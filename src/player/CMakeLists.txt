set (THIRD_PARTIES ${CMAKE_SOURCE_DIR}/third_parties)
set (THIRD_PARTIES_BINARIES ${CMAKE_BINARY_DIR}/third_parties)
set (GPAC_LOCATION ${THIRD_PARTIES}/gpac)



SET(CORE_PLAYER_SRC
${CMAKE_SOURCE_DIR}/src/player/core-player.c
${CMAKE_SOURCE_DIR}/src/player/parser-player.cpp
)

SET(EXTERNAL_RUNTIME
  "['stringToUTF8','UTF8ToString','stackAlloc','addFunction','allocateUTF8OnStack','getTempRet0','setTempRet0','FS','cwrap','ccall']"
)

add_executable(player ${CORE_PLAYER_SRC})

SET(JS_RUNTIME
  ${CMAKE_SOURCE_DIR}/src/player/loader.js
)

set_target_properties( player
                            PROPERTIES 
                                LINK_FLAGS "${USE_FLAGS} -s FETCH -s USE_ZLIB=1 -s USE_SDL=2 -s USE_FREETYPE=1 -s MAIN_MODULE=2 -s TOTAL_MEMORY=128MB --no-entry -s MODULARIZE=1 -s --extern-post-js=${JS_RUNTIME} EXPORTED_RUNTIME_METHODS=${EXTERNAL_RUNTIME} -s ERROR_ON_UNDEFINED_SYMBOLS=0"
                                )



target_link_libraries(player 
  libgpac_static.a
)

target_include_directories(player PRIVATE ${GPAC_LOCATION}/src/utils)