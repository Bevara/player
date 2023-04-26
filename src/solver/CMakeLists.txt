set (THIRD_PARTIES ${CMAKE_SOURCE_DIR}/third_parties)
set (THIRD_PARTIES_BINARIES ${CMAKE_BINARY_DIR}/third_parties)
set (GPAC_LOCATION ${THIRD_PARTIES}/gpac)

add_compile_definitions(GPAC_HAVE_CONFIG_H GPAC_DISABLE_DOC)

include(exports.cmake)

SET(SOLVER_SRC
  filter_register.c
  ${GPAC_LOCATION}/applications/gpac/gpac.c
  ${GPAC_LOCATION}/applications/gpac/gpac_help.c
)

SET(EXTERNAL_RUNTIME
  "['stringToUTF8','UTF8ToString','stackAlloc','addFunction','allocateUTF8OnStack','stackSave','getTempRet0','setTempRet0','FS','cwrap','ccall']"
)

add_executable(solver ${SOLVER_SRC})

SET(JS_RUNTIME
  ${CMAKE_SOURCE_DIR}/src/solver/loader.js
)

set_target_properties( solver
                            PROPERTIES 
                                #LINK_FLAGS "${USE_FLAGS} -s FETCH -s USE_ZLIB=1 -s USE_SDL=2 -s USE_FREETYPE=1 -s MAIN_MODULE=2 -s TOTAL_MEMORY=128MB --no-entry -s MODULARIZE=1 -s --extern-post-js=${JS_RUNTIME} EXPORTED_RUNTIME_METHODS=${EXTERNAL_RUNTIME} -s EXPORTED_FUNCTIONS=${EXTERNAL_FN} -s ERROR_ON_UNDEFINED_SYMBOLS=0"
                                LINK_FLAGS "${USE_FLAGS} -sALLOW_MEMORY_GROWTH -sWASM_BIGINT -s MAIN_MODULE=2 -s EXPORT_NAME=libgpac -s USE_ZLIB=1 -s USE_SDL=2 -s USE_FREETYPE=1 -s TOTAL_MEMORY=128MB --no-entry -s MODULARIZE=1 -s EXPORTED_FUNCTIONS=[${EXPORTED_FUNCTIONS}] -s --extern-post-js=${JS_RUNTIME} EXPORTED_RUNTIME_METHODS=${EXTERNAL_RUNTIME} -s ERROR_ON_UNDEFINED_SYMBOLS=0"
                                )



target_link_libraries(solver 
  libgpac_static.a
)

target_include_directories(solver PRIVATE ${GPAC_LOCATION}/src/utils)