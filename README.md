How to use:
Add a .sav file(from the isle) into a folder will the .js file and both .bat files, then open it with the DecryptSav.bat, this should extract it into a readable json, do your edits and then rencrypt it via opening the encrypt bat with a json file, all non elder mutations can be changed, growth(from 0.0 to 0.75), species, modifers and colour(have not tested this a lot) as well as location. 

OBSERVE: if you break the save with the wrong values you may break the save and need to revert it, ALWAYS keep a backup save, if you break something and load it into the server the server may overwrite your save. If you want to change from Omniraptor to Stegosaurus you need to replace all mentions of Omniraptor in the file location, you might also want to change the skin. 

For example: "Class": "/Game/TheIsle/Core/Characters/Dinosaurs/Troodon/BP_Troodon.BP_Troodon_C", Becomes: "Class": "/Game/TheIsle/Core/Characters/Dinosaurs/Omniraptor/BP_Omniraptor.BP_Omniraptor_C",

Players need to be logged out and if you change class it needs to be a pickable class in spawn menu. Save editing is volitaile, be careful.

As of 0.20.156