
set(CMAKE_EXECUTABLE_SUFFIX ".wasm")

add_executable(nanojpeg ${CMAKE_SOURCE_DIR}/filters/nanojpeg.c)

target_link_libraries(nanojpeg
${CMAKE_BINARY_DIR}/third_parties/nanojpeg/nanojpeg.o
)

set_target_properties( nanojpeg 
                        PROPERTIES 
                            LINK_FLAGS "${USE_FLAGS} -s SIDE_MODULE=2"
                            )