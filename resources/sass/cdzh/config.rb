# Get the directory that this configuration file exists in
dir = File.dirname(__FILE__)
# $ext_path = File.join(dir, '..', '..', '..', '../../lib/ext/ext-4.1.1a')
$ext_path = File.join( '..', '..', '..', '..', '../lib/ext/ext-4.1.1a')

# Load the extjs framework automatically.
load File.join(dir, '..', '..', '..', '../../lib/ext/ext-4.1.1a', 'resources', 'themes')

# Compass configurations
sass_path = dir
#css_path = File.join(dir, "..", "css")
css_path = File.join("../..", "css", "cdzh")

# Require any additional compass plugins here.
# images_dir = File.join(dir, "..", "images")
images_dir = File.join("../../css/cdzh", "images")
# output_style = :compressed
output_style = :expanded
environment = :production
