module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ";\n"
            },
            dist: {
                src: ['src/lang/extend.js',
                    'src/lang/leinterval.js',
                    'src/core.js',
                    'src/inner_begin.js',
                    'src/message.js',
                    'src/director.js',
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
                    'src/node/image.js',
                    'src/node/rectcolor.js',
                    'src/node/switch.js',
                    'src/scene/scene.js',
                    'src/action/action.js',
                    'src/action/action_instant.js',
                    'src/action/action_easy.js',
                    'src/event/mouseevent.js',
                    'src/event/keyboardevent.js',
                    'src/debugfps.js',
                    'src/inner_end.js',
                ],
                dest: 'js/<%= pkg.name %>-<%= pkg.version %>.js'
            } 
        },
        uglify: {
            dist: {
              src: 'js/<%= pkg.name %>-<%= pkg.version %>.js',
              dest: 'js/<%= pkg.name %>-<%= pkg.version %>.min.js'
            }
        },
        copy: {         
            history: {
                expand: true,
                cwd: 'js',
                src: ['*'],
                dest: './history/'
            },
            dest: {
                expand: true,
                cwd: 'js',
                src: ['*.js'],
                dest: '/Users/huanghui/web/www/js/'
            },
            test: {
                expand: true,
                cwd: 'test',
                src: ['**'],
                dest: '/Users/huanghui/web/www/test/le/test/'
            },
            src: {
                expand: true,
                cwd: 'test',
                src: ['**'],
                dest: '/Users/huanghui/web/www/test/le/src/'
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.registerTask('default', ['concat', 'uglify','copy']);
};