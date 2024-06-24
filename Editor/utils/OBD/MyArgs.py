class Args:
    def __init__(self):
        # params for prediction engine
        self.model_dir = None
        self.image_file = None
        self.image_dir = None
        self.batch_size = 1
        self.video_file = None
        self.camera_id = -1
        self.threshold = 0.5
        self.output_dir = "output"
        self.run_mode = 'paddle'
        self.device = 'cpu'
        self.use_gpu = False
        self.run_benchmark = False
        self.enable_mkldnn = False
        self.enable_mkldnn_bfloat16 = False
        self.cpu_threads = 1
        self.trt_min_shape = 1
        self.trt_max_shape = 1280
        self.trt_opt_shape = 640
        self.trt_calib_mode = False
        self.save_images = True
        self.save_mot_txts = False
        self.save_mot_txt_per_img = False
        self.scaled = False
        self.tracker_config = None
        self.reid_model_dir = None
        self.reid_batch_size = 50
        self.use_dark = True
        self.action_file = None
        self.window_size = 50
        self.random_pad = False
        self.save_results = False
        self.use_coco_category = False
        self.slice_infer = False
        self.slice_size = [640, 640]
        self.overlap_ratio = [0.25, 0.25]
        self.combine_method = 'nms'
        self.match_threshold = 0.6
        self.match_metric = 'ios'

