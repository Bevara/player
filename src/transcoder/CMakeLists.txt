SET(CORE_CODER_SRC
  ${CMAKE_SOURCE_DIR}/src/transcoder/core-transcoder.c
  ${CMAKE_SOURCE_DIR}/src/transcoder/parser-transcoder.cpp
)

SET(EXTERNAL_FN
  "['_wcdec_register','_wcenc_register','___threwValue','___THREW__','_fflush','_siprintf','_isatty','_fputs','_strtol','_tmpfile','_ftello','_fseeko','_fread','_fclose','_roundf','_round','___small_sprintf','_lrintf','_qsort','_testSetjmp','___multi3','_gmtime_r','_isalnum','_opendir','_mkdir','_fiprintf','_fputc','_memrchr','_atol','_saveSetjmp','___floatunsitf','___floatsitf','___trunctfdf2','___extenddftf2','___trunctfsf2','___multf3',___divtf3,'_free','_emscripten_stack_get_end','_emscripten_stack_set_limits','_gf_log','_gf_log_lt','_emscripten_longjmp','_gf_log_tool_level_on','_pthread_mutex_unlock','_pthread_mutex_lock','_pthread_self','_sprintf','_vfprintf','_fprintf','_bsearch','_posix_memalign','_calloc','_realloc','_memset','_memcpy','_memmove','_memalign','_memcmp','_gf_file_exists','_gf_fileio_read_mode','_gf_fileio_get_stats','_gf_fileio_check','_gf_fileio_from_url','_gf_fileio_open_url','_gf_fileio_write_mode','_gf_fileio_translate_url','_gf_fileio_url','_gf_fileio_new','_gf_fileio_set_stats','_gf_fileio_get_udta','_gf_url_concatenate']"
)

SET(EXTERNAL_RUNTIME
  "['stringToUTF8','UTF8ToString','stackAlloc','addFunction','getTempRet0','setTempRet0','FS','cwrap']"
)

SET(JS_RUNTIME
  ${CMAKE_SOURCE_DIR}/src/transcoder/loader.js
)

add_executable(core ${CORE_CODER_SRC})

set_target_properties(core
  PROPERTIES
  LINK_FLAGS "${USE_FLAGS} -s USE_ZLIB=1 -s INITIAL_MEMORY=167772160 -s ALLOW_MEMORY_GROWTH=1 --no-entry --extern-post-js=${JS_RUNTIME} -s MAIN_MODULE=2 -s MODULARIZE=1 -s EXPORTED_RUNTIME_METHODS=${EXTERNAL_RUNTIME} -s EXPORTED_FUNCTIONS=${EXTERNAL_FN} -s ERROR_ON_UNDEFINED_SYMBOLS=0"
)

target_link_libraries(core
  libgpac_static.a
)