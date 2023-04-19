
add_compile_definitions(GPAC_HAVE_CONFIG_H)

set(THIRD_PARTIES ${CMAKE_SOURCE_DIR}/third_parties)
set(THIRD_PARTIES_BINARIES ${CMAKE_BINARY_DIR}/third_parties)
set(GPAC_LOCATION ${THIRD_PARTIES}/gpac)

SET(JXLDEC_INC
        ${THIRD_PARTIES}/libjxl/lib/include
        ${THIRD_PARTIES_BINARIES}/libjxl/lib/include
)


SET(CORE_JXL
  ${CMAKE_SOURCE_DIR}/src/jxl/dec_jxl.c
  ${CMAKE_SOURCE_DIR}/src/jxl/reframe_jxl.c
  ${CMAKE_SOURCE_DIR}/src/transcoder/core-transcoder.c
  ${CMAKE_SOURCE_DIR}/src/transcoder/parser-transcoder.cpp
)

SET(EXTERNAL_FN
  "['_jxldec_register','_jxl_reframe_register','_writegen_register','_fileout_register','_filein_register','_gf_fileio_url','_gf_fileio_new','_gf_fileio_set_stats','_gf_fileio_get_udta','_gf_url_concatenate']"
)

SET(EXTERNAL_RUNTIME
"['stringToUTF8','UTF8ToString','stackAlloc','addFunction','allocateUTF8OnStack','getTempRet0','setTempRet0','FS','cwrap','ccall']"
)

SET(JS_RUNTIME_JXL
  ${CMAKE_SOURCE_DIR}/src/jxl/loader-jxl.js
)

add_executable(jxl ${CORE_JXL})

target_link_libraries(jxl
  ${THIRD_PARTIES_BINARIES}/gpac/bin/gcc/libgpac_static.a
  ${THIRD_PARTIES_BINARIES}/libjxl/lib/libjxl.a
  ${THIRD_PARTIES_BINARIES}/libjxl/third_party/highway/libhwy.a
)

target_compile_definitions(jxl PRIVATE GPAC_HAVE_CONFIG_H)

set_target_properties(jxl
  PROPERTIES
  LINK_FLAGS "${USE_FLAGS}  -s ALLOW_TABLE_GROWTH=1 -s ALLOW_MEMORY_GROWTH=1 --no-entry --extern-post-js=${JS_RUNTIME_JXL} -s MODULARIZE=1 -s EXPORTED_RUNTIME_METHODS=${EXTERNAL_RUNTIME} -s EXPORTED_FUNCTIONS=${EXTERNAL_FN} -s ERROR_ON_UNDEFINED_SYMBOLS=0"
)

target_include_directories(jxl PRIVATE ${JXLDEC_INC})

