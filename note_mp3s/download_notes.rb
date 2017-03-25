# notes from http://www.play-the-piano-online.com/piano-keyboard-fun-for-all
require "typhoeus"
require 'fileutils'
NATURAL_NOTE_NAMES = ["C", "D", "E", "F", "G", "A", "B"]
SHARP_NOTE_NAMES = ["Cs", "Ds", "Fs", "Gs", "As"]
FLAT_NOTE_NAMES = ["Db", "Eb", "Gb", "Ab", "Bb"]

# Natrual notes
white_notes = []
white_urls = []
white_notes << "A0" << "B0"
(1..7).each do |num|
	NATURAL_NOTE_NAMES.each do |letter|
		white_notes << letter + num.to_s
	end
end
white_notes << "C8"
(1..52).each do |num|
	white_urls << "http://play-the-piano-online.com/images/flash/SoundFX/w#{num}.mp3"
end

# All black notes. Save separate files for Enharmonics. they can have different file names, makes accessing the files easier
black_notes = []
black_urls = []
# Sharps
black_notes << "As0"
(1..7).each do |num|
	SHARP_NOTE_NAMES.each do |letter|
		black_notes << letter + num.to_s
	end
end
(1..36).each do |num|
	black_urls << "http://play-the-piano-online.com/images/flash/SoundFX/b#{num}.mp3"
end
# Flats
black_notes << "Bb0"
(1..7).each do |num|
	FLAT_NOTE_NAMES.each do |letter|
		black_notes << letter + num.to_s
	end
end
(1..36).each do |num|
	black_urls << "http://play-the-piano-online.com/images/flash/SoundFX/b#{num}.mp3"
end

# # Download the files and store them with the correct file name
# white_urls.each_with_index do |url, i|
# 	res = Typhoeus.get(url)
# 	FileUtils.touch("#{white_notes[i]}.mp3")
# 	f = open("#{white_notes[i]}.mp3", "w")
# 	f.write(res.body)
# end
# black_urls.each_with_index do |url, i|
# 	res = Typhoeus.get(url)
# 	FileUtils.touch("#{black_notes[i]}.mp3")
# 	f = open("#{black_notes[i]}.mp3", "w")
# 	f.write(res.body)
# end

# Sharps with white keys
all_sharps_with_white_keys = []
all_sharps_with_white_keys << "Bs0"
(1..7).each do |num|
	["Es", "Bs"].each do |letter|
		all_sharps_with_white_keys << letter + num.to_s
	end
end
all_sharps_with_white_keys.each do |note|
	if note[0] == "B"
		src = "C" + (note[-1].to_i + 1).to_s + ".mp3"
	else
		src = "F" + note[-1] + ".mp3"
	end
	FileUtils.cp(src, note + ".mp3")
end
# Flats with white keys
all_flats_with_white_keys = []
(1..7).each do |num|
	["Cb", "Fb"].each do |letter|
		all_flats_with_white_keys << letter + num.to_s
	end
end
all_flats_with_white_keys << "Cb8"
all_flats_with_white_keys.each do |note|
	if note[0] == "C"
		src = "B" + (note[-1].to_i - 1).to_s + ".mp3"
	else
		src = "E" + note[-1] + ".mp3"
	end
	FileUtils.cp(src, note + ".mp3")
end
