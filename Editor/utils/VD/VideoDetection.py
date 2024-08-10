# Copyright (c) 2020 PaddlePaddle Authors. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import argparse
import os
from os import path as osp
import paddle
from paddle import inference
from paddle.inference import Config, create_predictor

from Editor.utils.VD.utils import build_inference_helper
from Editor.utils.VD.paddlevideo.utils import get_config

from Editor.utils.VD.Args import Args
def create_paddle_predictor(file_path, cfg):
    args=Args()
    args.input_file=file_path
    args.config="configs/recognition/pptsm/v2/pptsm_lcnet_k400_16frames_uniform_dml_distillation.yaml"
    args.model_file="inference/PPTSMv2/ppTSMv2.pdmodel"
    args.params_file="inference/PPTSMv2/ppTSMv2.pdiparams"
    args.use_gpu=True
    args.use_tensorrt=False
    config = Config(args.model_file, args.params_file)
    if args.use_gpu:
        config.enable_use_gpu(args.gpu_mem, 0)
    elif args.use_npu:
        config.enable_npu()
    elif args.use_xpu:
        config.enable_xpu()
    else:
        config.disable_gpu()
        if args.cpu_threads:
            config.set_cpu_math_library_num_threads(args.cpu_threads)
        if args.enable_mkldnn:
            # cache 10 different shapes for mkldnn to avoid memory leak
            config.set_mkldnn_cache_capacity(10)
            config.enable_mkldnn()
            if args.precision == "fp16":
                config.enable_mkldnn_bfloat16()

    # config.disable_glog_info()
    config.switch_ir_optim(args.ir_optim)  # default true
    if args.use_tensorrt:
        # choose precision
        if args.precision == "fp16":
            precision = inference.PrecisionType.Half
        elif args.precision == "int8":
            precision = inference.PrecisionType.Int8
        else:
            precision = inference.PrecisionType.Float32

        # calculate real max batch size during inference when tenrotRT enabled
        max_batch_size = args.batch_size
        if 'num_seg' in cfg.INFERENCE:
            # num_seg: number of segments when extracting frames.
            # seg_len: number of frames extracted within a segment, default to 1.
            # num_views: the number of video frame groups obtained by cropping and flipping,
            # uniformcrop=3, tencrop=10, centercrop=1.
            num_seg = cfg.INFERENCE.num_seg
            seg_len = cfg.INFERENCE.get('seg_len', 1)
            num_views = 1
            if 'tsm' in cfg.model_name.lower():
                num_views = 1  # CenterCrop
            elif 'tsn' in cfg.model_name.lower():
                num_views = 10  # TenCrop
            elif 'timesformer' in cfg.model_name.lower():
                num_views = 3  # UniformCrop
            elif 'videoswin' in cfg.model_name.lower():
                num_views = 3  # UniformCrop
            elif 'tokenshift' in cfg.model_name.lower():
                num_views = 3  # UniformCrop
            max_batch_size = args.batch_size * num_views * num_seg * seg_len
        config.enable_tensorrt_engine(
            precision_mode=precision, max_batch_size=max_batch_size)

    config.enable_memory_optim()
    # use zero copy
    config.switch_use_feed_fetch_ops(False)

    # disable glog
    if args.disable_glog:
        config.disable_glog_info()

    # for ST-GCN tensorRT case usage
    # config.delete_pass("shuffle_channel_detect_pass")

    predictor = create_predictor(config)

    return config, predictor


def parse_file_paths(input_path: str) -> list:
    if osp.isfile(input_path):
        files = [
            input_path,
        ]
    else:
        files = os.listdir(input_path)
        files = [
            file for file in files
            if (file.endswith(".avi") or file.endswith(".mp4"))
        ]
        files = [osp.join(input_path, file) for file in files]
    return files


def predict(file_path):
    """predict using paddle inference model
    """
    args = Args()
    args.input_file=file_path
    args.config="configs/recognition/pptsm/v2/pptsm_lcnet_k400_16frames_uniform_dml_distillation.yaml"
    args.model_file="inference/PPTSMv2/PPTSMv2.pdmodel"
    args.params_file="inference/PPTSMv2/PPTSMv2.pdiparams"
    args.use_gpu=True
    args.use_tensorrt=False
    cfg = get_config(args.config, overrides=args.override, show=False)

    model_name = cfg.model_name
    print(f"Inference model({model_name})...")
    InferenceHelper = build_inference_helper(cfg.INFERENCE)

    inference_config, predictor = create_paddle_predictor(args, cfg)

    # get input_tensor and output_tensor
    input_names = predictor.get_input_names()
    output_names = predictor.get_output_names()
    input_tensor_list = []
    output_tensor_list = []
    for item in input_names:
        input_tensor_list.append(predictor.get_input_handle(item))
    for item in output_names:
        output_tensor_list.append(predictor.get_output_handle(item))

    # get the absolute file path(s) to be processed
    if model_name in ["MSTCN", "ASRF"]:
        files = InferenceHelper.get_process_file(args.input_file)
    else:
        files = parse_file_paths(args.input_file)

    if model_name == 'TransNetV2':
        for file in files:
            inputs = InferenceHelper.preprocess(file)
            outputs = []
            for input in inputs:
                # Run inference
                for i in range(len(input_tensor_list)):
                    input_tensor_list[i].copy_from_cpu(input)
                predictor.run()
                output = []
                for j in range(len(output_tensor_list)):
                    output.append(output_tensor_list[j].copy_to_cpu())
                outputs.append(output)

            # Post process output
            InferenceHelper.postprocess(outputs)

    elif model_name == 'AVA_SlowFast_FastRcnn':
        for file in files:  # for videos
            inputs = InferenceHelper.preprocess(file)
            outputs = []
            for input in inputs:
                # Run inference
                input_len = len(input_tensor_list)

                for i in range(input_len):
                    if type(input[i]) == paddle.Tensor:
                        input_tmp = input[i].numpy()
                    else:
                        input_tmp = input[i]
                    input_tensor_list[i].copy_from_cpu(input_tmp)
                predictor.run()
                output = []
                for j in range(len(output_tensor_list)):
                    output.append(output_tensor_list[j].copy_to_cpu())
                outputs.append(output)

            # Post process output
            InferenceHelper.postprocess(outputs)
    elif model_name == 'YOWO':
        for file in files:  # for videos
            (_, filename) = os.path.split(file)
            (filename, _) = os.path.splitext(filename)
            save_dir = osp.join('inference', 'YOWO_infer')
            if not osp.exists('inference'):
                os.mkdir('inference')
            if not osp.exists(save_dir):
                os.mkdir(save_dir)
            save_path = osp.join(save_dir, filename)
            if not osp.exists(save_path):
                os.mkdir(save_path)
            inputs, frames = InferenceHelper.preprocess(file)
            for idx, input in enumerate(inputs):
                # Run inference
                outputs = []
                input_len = len(input_tensor_list)
                for i in range(input_len):
                    input_tensor_list[i].copy_from_cpu(input[i])
                predictor.run()
                for j in range(len(output_tensor_list)):
                    outputs.append(output_tensor_list[j].copy_to_cpu())
                # Post process output
                InferenceHelper.postprocess(outputs, frames[idx], osp.join(save_path, str(idx).zfill(3)))
    else:
        if args.enable_benchmark:
            num_warmup = 3

            # instantiate auto log
            try:
                import auto_log
            except ImportError as e:
                print(f"{e}, [git+https://github.com/LDOUBLEV/AutoLog] "
                      f"package and it's dependencies is required for "
                      f"python-inference when enable_benchmark=True.")
            pid = os.getpid()
            autolog = auto_log.AutoLogger(
                model_name=cfg.model_name,
                model_precision=args.precision,
                batch_size=args.batch_size,
                data_shape="dynamic",
                save_path="./output/auto_log.lpg",
                inference_config=inference_config,
                pids=pid,
                process_name=None,
                gpu_ids=0 if args.use_gpu else None,
                time_keys=[
                    'preprocess_time', 'inference_time', 'postprocess_time'
                ],
                warmup=num_warmup)
            if not args.time_test_file:
                test_video_num = 15
                files = [args.input_file for _ in range(test_video_num)]
            else:
                f_input = open(args.input_file, 'r')
                files = [i.strip() for i in f_input.readlines()]
                test_video_num = len(files)
                f_input.close()

        # Inferencing process
        batch_num = args.batch_size
        for st_idx in range(0, len(files), batch_num):
            ed_idx = min(st_idx + batch_num, len(files))

            # auto log start
            if args.enable_benchmark:
                autolog.times.start()

            # Pre process batched input
            batched_inputs = InferenceHelper.preprocess_batch(
                files[st_idx:ed_idx])

            # get pre process time cost
            if args.enable_benchmark:
                autolog.times.stamp()

            # run inference
            for i in range(len(input_tensor_list)):
                input_tensor_list[i].copy_from_cpu(batched_inputs[i])
            predictor.run()

            batched_outputs = []
            for j in range(len(output_tensor_list)):
                batched_outputs.append(output_tensor_list[j].copy_to_cpu())

            # get inference process time cost
            if args.enable_benchmark:
                autolog.times.stamp()

            results=InferenceHelper.postprocess(batched_outputs,
                                        not args.enable_benchmark)

            # get post process time cost
            if args.enable_benchmark:
                autolog.times.end(stamp=True)

            # time.sleep(0.01)  # sleep for T4 GPU

    # report benchmark log if enabled
    if args.enable_benchmark:
        autolog.report()
    with open("Kinetics-400_label_list.txt") as ff:
        line=ff.readlines().split(" ")
        if line[0]==results[0]['topk_class']:
            results[0]['topk_class']=line[1]
    return results


