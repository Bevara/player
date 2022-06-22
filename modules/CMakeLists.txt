set(CMAKE_EXECUTABLE_SUFFIX ".wasm")

set (THIRD_PARTIES ${CMAKE_SOURCE_DIR}/third_parties)
set (THIRD_PARTIES_BINARIES ${CMAKE_BINARY_DIR}/third_parties)
set (GPAC_LOCATION ${THIRD_PARTIES}/gpac)

add_compile_definitions(GPAC_HAVE_CONFIG_H)

SET(SDL_ENTRIES  
    ${GPAC_LOCATION}/modules/sdl_out/sdl_out.c
    ${GPAC_LOCATION}/modules/sdl_out/video.c
    ${GPAC_LOCATION}/modules/sdl_out/audio.c
    ${GPAC_LOCATION}/src/utils/os_thread.c
)

add_executable(sdl_out ${SDL_ENTRIES})

set_target_properties(sdl_out
                        PROPERTIES 
                            LINK_FLAGS "-s SIDE_MODULE=2 -s EXPORTED_FUNCTIONS=_gf_register_module_sdl_out ${LINK_FLAGS}"
                            )

target_compile_definitions(sdl_out PRIVATE GPAC_STATIC_MODULES)
#target_include_directories(sdl_out PRIVATE ${INCLUDES})