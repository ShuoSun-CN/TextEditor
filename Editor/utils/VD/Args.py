class Args:
    def __init__(self):
        # general params
        self.config = 'configs/example.yaml'
        self.override = []
        self.input_file = None
        self.time_test_file = False
        self.model_file = None
        self.params_file = None

        # params for paddle predict
        self.batch_size = 1
        self.use_gpu = True
        self.use_xpu = False
        self.use_npu = False
        self.precision = "fp32"
        self.ir_optim = True
        self.use_tensorrt = False
        self.gpu_mem = 8000
        self.enable_benchmark = False
        self.enable_mkldnn = False
        self.cpu_threads = None
        self.disable_glog = False

