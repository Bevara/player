
set(CMAKE_EXECUTABLE_SUFFIX ".wasm")

set (THIRD_PARTIES ${CMAKE_SOURCE_DIR}/third_parties)
set (THIRD_PARTIES_BINARIES ${CMAKE_BINARY_DIR}/third_parties)
set (GPAC_LOCATION ${THIRD_PARTIES}/gpac)

add_compile_definitions(GPAC_HAVE_CONFIG_H)


macro(add_filter FILTERNAME ENTRYFILES LINKFILES ENTRY_FN DEFINITIONS INCLUDES LINK_FLAGS)

add_executable(${FILTERNAME} ${ENTRYFILES})

target_link_libraries(${FILTERNAME} ${LINKFILES})

set_target_properties(${FILTERNAME}
                        PROPERTIES 
                            LINK_FLAGS "-s SIDE_MODULE=2 -s EXPORTED_FUNCTIONS=${ENTRY_FN} ${LINK_FLAGS}"
                            )

target_compile_definitions(${FILTERNAME} PRIVATE ${DEFINITIONS})
target_include_directories(${FILTERNAME} PRIVATE ${INCLUDES})

endmacro()

add_filter(nanojpeg
                ${CMAKE_SOURCE_DIR}/filters/nanojpeg.c
                ${THIRD_PARTIES_BINARIES}/nanojpeg/nanojpeg.o
                _nanojpeg_register
                ""
                ""
                "")

SET(IMG_DEC_SRC 
    ${GPAC_LOCATION}/src/filters/dec_img.c
    ${GPAC_LOCATION}/src/media_tools/img.c)


add_filter(imgdec
                "${IMG_DEC_SRC}"
                ""
                _imgdec_register
                GPAC_HAS_JPEG
                ${GPAC_LOCATION}/include
                "-s USE_LIBJPEG=1")
SET(RFIMG_SRC 
        ${GPAC_LOCATION}/src/filters/reframe_img.c
        ${GPAC_LOCATION}/src/media_tools/img.c
        ${GPAC_LOCATION}/src/utils/bitstream.c)

add_filter(rfimg
                "${RFIMG_SRC}"
                ""
                _img_reframe_register
                GPAC_HAS_JPEG
                ""
                "-s USE_LIBJPEG=1")

SET(WRITEGEN_SRC
    ${GPAC_LOCATION}/src/filters/write_generic.c
    ${GPAC_LOCATION}/src/utils/constants.c
    ${GPAC_LOCATION}/src/utils/os_config_init.c
)

add_filter(writegen
                "${WRITEGEN_SRC}"
                ""
                _writegen_register
                ""
                ""
                "")

add_filter(pngenc
                ${GPAC_LOCATION}/src/filters/enc_png.c
                ${THIRD_PARTIES_BINARIES}/libpng/libpng16.a
                _pngenc_register
                GPAC_HAS_PNG
                ""
                "")
SET(J2KDEC_LIB
${THIRD_PARTIES}/openjpeg/src/lib/openjp2
${THIRD_PARTIES_BINARIES}/openjpeg/src/lib/openjp2
)

add_filter(j2kdec
                ${GPAC_LOCATION}/src/filters/dec_j2k.c
                ${THIRD_PARTIES_BINARIES}/openjpeg/bin/libopenjp2.a
                _j2kdec_register
                GPAC_HAS_JP2
                "${J2KDEC_LIB}"
                "")