// Copyright (c) the JPEG XL Project Authors. All rights reserved.
//
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

#include "jxl-decoder.h"
/*
#include <cstring>
#include <memory>
#include <vector>*/

#include <stdio.h>
#include <stdlib.h>

#include "jxl/decode.h"
//#include "jxl/decode_cxx.h"
//#include "jxl/thread_parallel_runner_cxx.h"

#ifdef __cplusplus
extern "C" {  
#endif

#ifdef __cplusplus
namespace {
#endif

typedef struct  {
  // Due to "Standard Layout" rules it is guaranteed that address of the entity
  // and its first non-static member are the same.
  DecoderInstance info;

  size_t pixels_size;// = 0;
  uint32_t want_sdr;
  uint32_t display_nits;
  JxlPixelFormat format;
  //JxlDecoderPtr decoder;
  JxlDecoder* decoder;
  //JxlThreadParallelRunnerPtr thread_pool;

  //std::vector<uint8_t> tail;
}DecoderInstancePrivate;

#ifdef __cplusplus
}  // namespace
#endif

DecoderInstance* jxlCreateInstance(uint32_t want_sdr, uint32_t display_nits) {
  //DecoderInstancePrivate* self = new DecoderInstancePrivate();
  DecoderInstancePrivate* self = (DecoderInstancePrivate*) malloc(sizeof(DecoderInstancePrivate));

  if (!self) {
    return 0;
  }

  self->want_sdr = want_sdr;
  self->display_nits = display_nits;
  JxlDataType storageFormat = want_sdr ? JXL_TYPE_UINT8 : JXL_TYPE_UINT16;
  //self->format = {4, storageFormat, JXL_NATIVE_ENDIAN, 0};
  self->format.num_channels = 4;
  self->format.data_type = storageFormat;
  self->format.endianness = JXL_NATIVE_ENDIAN;
  self->format.align = 0;
  //, storageFormat, JXL_NATIVE_ENDIAN, 0};
  //self->decoder = JxlDecoderMake(nullptr);
  self->decoder = JxlDecoderCreate(0);

  //JxlDecoder* dec = self->decoder.get();
  JxlDecoder* dec = self->decoder;

/*  auto report_error = [&](uint32_t code, const char* text) {
    fprintf(stderr, "%s\n", text);
    delete self;
    return reinterpret_cast<DecoderInstance*>(code);
  };*/

  //self->thread_pool = JxlThreadParallelRunnerMake(nullptr, 4);
  //void* runner = self->thread_pool.get();

  /*auto status =
      JxlDecoderSetParallelRunner(dec, JxlThreadParallelRunner, runner);

  if (status != JXL_DEC_SUCCESS) {
    return report_error(1, "JxlDecoderSetParallelRunner failed");
  }*/

  JxlDecoderStatus status = JxlDecoderSubscribeEvents(
      dec, JXL_DEC_BASIC_INFO | JXL_DEC_COLOR_ENCODING | JXL_DEC_FULL_IMAGE |
               JXL_DEC_FRAME_PROGRESSION);
  if (JXL_DEC_SUCCESS != status) {
    printf( "JxlDecoderSubscribeEvents failed");
  }

  status = JxlDecoderSetProgressiveDetail(dec, kPasses);
  if (JXL_DEC_SUCCESS != status) {
    printf("JxlDecoderSetProgressiveDetail failed");
  }
  return &self->info;
}

void jxlDestroyInstance(DecoderInstance* instance) {
  if (instance == 0) return;
 /* DecoderInstancePrivate* self =
      reinterpret_cast<DecoderInstancePrivate*>(instance);*/
  if (instance->pixels) {
    free(instance->pixels);
  }
  //delete self;
}

uint32_t jxlProcessInput(DecoderInstance* instance, const uint8_t* input,
                         size_t input_size) {
  if (instance == 0) return -1;
  /*DecoderInstancePrivate* self =
      reinterpret_cast<DecoderInstancePrivate*>(instance);*/
  DecoderInstancePrivate* self = (DecoderInstancePrivate*) instance;
  //JxlDecoder* dec = self->decoder.get();
  JxlDecoder* dec = self->decoder;

  /*auto report_error = [&](int code, const char* text) {
    fprintf(stderr, "%s\n", text);
    return static_cast<uint32_t>(code);
  };*/

  /*std::vector<uint8_t>& tail = self->tail;
  if (!tail.empty()) {
    tail.reserve(tail.size() + input_size);
    tail.insert(tail.end(), input, input + input_size);
    input = tail.data();
    input_size = tail.size();
  }*/

  JxlDecoderStatus status = JxlDecoderSetInput(dec, input, input_size);
  if (JXL_DEC_SUCCESS != status) {
    printf("JxlDecoderSetInput failed");
    return -1;
  }

  /*auto release_input = [&]() {
    size_t unused_input = JxlDecoderReleaseInput(dec);
    if (unused_input == 0) {
      tail.clear();
      return;
    }
    if (tail.empty()) {
      tail.insert(tail.end(), input + input_size - unused_input,
                  input + input_size);
    } else {
      memmove(tail.data(), tail.data() + tail.size() - unused_input,
              unused_input);
      tail.resize(unused_input);
    }
  };*/

  while (1) {
    status = JxlDecoderProcessInput(dec);
    if (JXL_DEC_SUCCESS == status) {
      //release_input();
      return 0;  // ¯\_(ツ)_/¯
    } else if (JXL_DEC_FRAME_PROGRESSION == status) {
      //release_input();
      return 1;  // ready to flush; client will decide whether it is necessary
    } else if (JXL_DEC_NEED_MORE_INPUT == status) {
      //release_input();
      return 2;
    } else if (JXL_DEC_FULL_IMAGE == status) {
      //release_input();
      return 0;  // final image is ready
    } else if (JXL_DEC_BASIC_INFO == status) {
      JxlBasicInfo info;
      status = JxlDecoderGetBasicInfo(dec, &info);
      if (status != JXL_DEC_SUCCESS) {
        //release_input();
        printf( "JxlDecoderGetBasicInfo failed");
        return -1;
      }
      instance->width = info.xsize;
      instance->height = info.ysize;
      status =
          JxlDecoderImageOutBufferSize(dec, &self->format, &self->pixels_size);
      if (status != JXL_DEC_SUCCESS) {
        //release_input();
        printf("JxlDecoderImageOutBufferSize failed");
        return -1;
      }
      if (instance->pixels) {
        //release_input();
        printf("Tried to realloc pixels");
        return -1;
      }
      instance->pixels = (uint8_t*)(malloc(self->pixels_size));
    } else if (JXL_DEC_NEED_IMAGE_OUT_BUFFER == status) {
      if (!self->info.pixels) {
        //release_input();
        printf("Out buffer not allocated");
        return -1;
      }
      status = JxlDecoderSetImageOutBuffer(dec, &self->format, instance->pixels,
                                           self->pixels_size);
      if (status != JXL_DEC_SUCCESS) {
        //release_input();
        printf("JxlDecoderSetImageOutBuffer failed");
        return -1;
      }
    } else if (JXL_DEC_COLOR_ENCODING == status) {
      JxlColorEncoding color_encoding;
      color_encoding.color_space = JXL_COLOR_SPACE_RGB;
      color_encoding.white_point = JXL_WHITE_POINT_D65;
      color_encoding.primaries =
          self->want_sdr ? JXL_PRIMARIES_SRGB : JXL_PRIMARIES_2100;
      color_encoding.transfer_function = self->want_sdr
                                             ? JXL_TRANSFER_FUNCTION_SRGB
                                             : JXL_TRANSFER_FUNCTION_PQ;
      color_encoding.rendering_intent = JXL_RENDERING_INTENT_PERCEPTUAL;
      status = JxlDecoderSetPreferredColorProfile(dec, &color_encoding);
      if (status != JXL_DEC_SUCCESS) {
        //release_input();
        printf("JxlDecoderSetPreferredColorProfile failed");
        return -1;
      }
    } else {
      //release_input();
      printf("Unexpected decoder status");
      return -1;
    }
  }

  //release_input();
  return 0;
}

uint32_t jxlFlush(DecoderInstance* instance) {
  if (instance == 0) return -1;
  DecoderInstancePrivate* self =(DecoderInstancePrivate*)(instance);
  //JxlDecoder* dec = self->decoder.get();
  JxlDecoder* dec = self->decoder;

  /*auto report_error = [&](int code, const char* text) {
    fprintf(stderr, "%s\n", text);
    // self->result = code;
    return static_cast<uint32_t>(code);
  };*/

  if (!instance->pixels) {
    printf("Not ready to flush");
    return 0;
  }

  JxlDecoderStatus status = JxlDecoderFlushImage(dec);
  if (status != JXL_DEC_SUCCESS) {
    printf("Failed to flush");
    return 0;
  }

  return 0;
}

#ifdef __cplusplus
}
#endif