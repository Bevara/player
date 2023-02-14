set(THIRD_PARTIES_SRC ${CMAKE_SOURCE_DIR}/third_parties)
set(THIRD_PARTIES_BUILD ${CMAKE_BINARY_DIR}/third_parties)


SET(JXL_DECODER_INCLUDES
  ${THIRD_PARTIES_SRC}/libjxl/lib/include
  ${THIRD_PARTIES_BUILD}/libjxl/lib/include
)


SET(JXL_DECODER_SRC
  ${CMAKE_SOURCE_DIR}/src/jxl-decoder/jxl-decoder.cc
)

add_executable(jxl-decoder ${JXL_DECODER_SRC})


SET(EXTERNAL_FN
  "['_jxlCreateInstance','_jxlDestroyInstance','_jxlFlush','_jxlProcessInput','_free']"
)

set_target_properties( jxl-decoder
                        PROPERTIES 
                            LINK_FLAGS "${USE_FLAGS} -s EXPORT_NAME='JxlCodecModule' -s ALLOW_MEMORY_GROWTH=1 -s DISABLE_EXCEPTION_CATCHING=1 -s USE_PTHREADS=1 -s PTHREAD_POOL_SIZE=4 -s MODULARIZE=1 -s EXPORTED_FUNCTIONS=${EXTERNAL_FN} -s ERROR_ON_UNDEFINED_SYMBOLS=0"
                            )

target_include_directories(jxl-decoder PRIVATE ${JXL_DECODER_INCLUDES})

target_link_libraries(jxl-decoder
  libgpac_static.a
  ${THIRD_PARTIES_BUILD}/libjxl/lib/libjxl.a
  ${THIRD_PARTIES_BUILD}/libjxl/lib/libjxl_threads.a
  ${THIRD_PARTIES_BUILD}/libjxl/third_party/highway/libhwy.a
  ${THIRD_PARTIES_BUILD}/brotli/libbrotlidec.a
  ${THIRD_PARTIES_BUILD}/brotli/libbrotlicommon.a
)