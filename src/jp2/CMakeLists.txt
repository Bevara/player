
set(THIRD_PARTIES ${CMAKE_SOURCE_DIR}/third_parties)
set(THIRD_PARTIES_BINARIES ${CMAKE_BINARY_DIR}/third_parties)
set(GPAC_LOCATION ${THIRD_PARTIES}/gpac)

SET(J2KDEC_INC
        ${THIRD_PARTIES}/openjpeg/src/lib/openjp2
        ${THIRD_PARTIES_BINARIES}/openjpeg/src/lib/openjp2
)


SET(CORE_JP2
  ${GPAC_LOCATION}/src/filters/write_generic.c
  ${GPAC_LOCATION}/src/filters/out_file.c
  ${GPAC_LOCATION}/src/filters/in_file.c
  ${GPAC_LOCATION}/src/filters/reframe_img.c
  ${GPAC_LOCATION}/src/filters/dec_j2k.c
  ${CMAKE_SOURCE_DIR}/src/transcoder/core-transcoder.c
  ${CMAKE_SOURCE_DIR}/src/transcoder/parser-transcoder.cpp
)

SET(EXTERNAL_FN
  "['_writegen_register','_fileout_register','_filein_register','_gf_fileio_url','_gf_fileio_new','_gf_fileio_set_stats','_gf_fileio_get_udta','_gf_url_concatenate']"
)

SET(EXTERNAL_RUNTIME
"['stringToUTF8','UTF8ToString','stackAlloc','addFunction','allocateUTF8OnStack','getTempRet0','setTempRet0','FS','cwrap','ccall']"
)

SET(JS_RUNTIME_JP2
  ${CMAKE_SOURCE_DIR}/src/jp2/loader-jp2.js
)

add_executable(jp2 ${CORE_JP2})

target_link_libraries(jp2
  ${THIRD_PARTIES_BINARIES}/gpac/bin/gcc/libgpac_static.a
  ${THIRD_PARTIES_BINARIES}/openjpeg/bin/libopenjp2.a
)

target_compile_definitions(jp2 PRIVATE GPAC_HAVE_CONFIG_H GPAC_HAS_JP2)

set_target_properties(jp2
  PROPERTIES
  LINK_FLAGS "${USE_FLAGS} -s ALLOW_TABLE_GROWTH=1 -s ALLOW_MEMORY_GROWTH=1 --no-entry --extern-post-js=${JS_RUNTIME_JP2} -s MODULARIZE=1 -s EXPORTED_RUNTIME_METHODS=${EXTERNAL_RUNTIME} -s EXPORTED_FUNCTIONS=${EXTERNAL_FN} -s ERROR_ON_UNDEFINED_SYMBOLS=0"
)

target_include_directories(jp2 PRIVATE ${J2KDEC_INC})

