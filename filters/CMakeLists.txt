
set(CMAKE_EXECUTABLE_SUFFIX ".wasm")

set (THIRD_PARTIES ${CMAKE_SOURCE_DIR}/third_parties)
set (GPAC_LOCATION ${THIRD_PARTIES}/gpac)

add_compile_definitions(GPAC_HAVE_CONFIG_H)
add_compile_definitions(GPAC_HAS_JPEG)

add_executable(nanojpeg ${CMAKE_SOURCE_DIR}/filters/nanojpeg.c)

target_link_libraries(nanojpeg
${CMAKE_BINARY_DIR}/third_parties/nanojpeg/nanojpeg.o
)

set_target_properties( nanojpeg 
                        PROPERTIES 
                            LINK_FLAGS "${USE_FLAGS} -s SIDE_MODULE=2"
                            )
     
add_executable(imgdec ${GPAC_LOCATION}/src/filters/dec_img.c
                        ${GPAC_LOCATION}/src/media_tools/img.c)

set_target_properties( imgdec 
                        PROPERTIES 
                            LINK_FLAGS "${USE_FLAGS} -s SIDE_MODULE=2 -s EXPORTED_FUNCTIONS=_imgdec_register"
                            )