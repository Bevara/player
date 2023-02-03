set(THIRD_PARTIES_SRC ${CMAKE_SOURCE_DIR}/third_parties)
set(THIRD_PARTIES_BUILD ${CMAKE_BINARY_DIR}/third_parties)


SET(JXL_CODER_INCLUDES
  ${THIRD_PARTIES_SRC}/libjxl/lib/include
  ${THIRD_PARTIES_BUILD}/libjxl/lib/include
)


SET(JXL_CODER_SRC
  ${CMAKE_SOURCE_DIR}/src/jxl-coder/jxl-coder.c
  ${CMAKE_SOURCE_DIR}/src/jxl-coder/parser-jxl-coder.cpp
)

add_executable(jxl-coder ${JXL_CODER_SRC})


SET(EXTERNAL_FN
  "['_gf_fileio_new','_gf_fileio_url']"
)

set_target_properties( jxl-coder
                        PROPERTIES 
                            LINK_FLAGS "${USE_FLAGS} -s TOTAL_MEMORY=128MB --no-entry -s MAIN_MODULE=2  -s MODULARIZE=1 -s EXPORTED_FUNCTIONS=${EXTERNAL_FN} -s ERROR_ON_UNDEFINED_SYMBOLS=0"
                            )

target_include_directories(jxl-coder PRIVATE ${JXL_CODER_INCLUDES})

target_link_libraries(jxl-coder
  libgpac_static.a
  ${THIRD_PARTIES_BUILD}/libjxl/lib/libjxl.a
  ${THIRD_PARTIES_BUILD}/libjxl/third_party/highway/libhwy.a
  ${THIRD_PARTIES_BUILD}/brotli/libbrotlidec.a
  ${THIRD_PARTIES_BUILD}/brotli/libbrotlicommon.a
)