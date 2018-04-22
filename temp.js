module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            step1: {              
                options: {
                    separator: ";\n"
                },
                banner: "\n(function(le){\n",
                footer: "\n})(window.le);\n",
                dist: {
                    src: ['src/lang/extend.js',
                        'src/core.js',
                        'src/game.js',
                        'src/lang/agent.js',
                        'src/lang/device.js',
                        'src/timer.js',
                        'src/loader/loader.js',
                        'src/loader/spriteframe.js',
                        'src/loader/spriteframecache.js',
                        'src/font/sysfont.js',
                        'src/font/bitmapfont.js',
                        'src/node/node.js',
                        'src/node/layer.js',
                        'src/node/sprite.js',
                        'src/node/label.js',
                        'src/node/button.js',
                        'src/node/input.js',
                        'src/node/video.js',
                        'src/scene/scene.js',
                        'src/action/action_interval.js',
                        'src/action/action_instant.js',
                        'src/action/action_easy.js',
                        'src/event/mouseevent.js',
                        'src/event/keyboardevent.js',
                        'src/debugfps.js'
                    ],
                    dest: 'js/temp.js'
                } 
            },

            step2: {                
                options: {
                    separator: ";\n"
                },
                dist: {
                    src: ['src/lang/extend.js',
                        'src/core.js',
                        'js/temp.js'
                    ],
                    dest: 'js/<%= pkg.name %><%= pkg.version %>.js'
                }
            }    
        },
        uglify: {
            dist: {
              src: 'js/<%= pkg.name %><%= pkg.version %>.js',
              dest: 'js/<%= pkg.name %><%= pkg.version %>.min.js'
            }
        },
        copy: {
            main: {
              src: 'js/<%= pkg.name %><%= pkg.version %>.js',
              dest: 'js/<%= pkg.name %>.js'                
            },            
            min: {
              src: 'js/<%= pkg.name %><%= pkg.version %>.min.js',
              dest: 'js/<%= pkg.name %>.min.js'
            },            
            dest: {
                expand: true,
                cwd: 'js',
                src: ['*'],
                dest: '/Users/huanghui/web/www/js/'
            },
            test: {
                expand: true,
                cwd: 'test',
                src: ['**'],
                dest: '/Users/huanghui/web/www/test/'
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.registerTask('default', ['concat', 'uglify', 'copy:main', 'copy:min', 'copy:dest']);
};