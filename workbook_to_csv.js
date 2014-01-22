document = app.activeDocument;

textFrames = document.textFrames

character_style_texts = new Object();
paragraph_style_texts = new Object();

for(tf_index=0;tf_index<textFrames.length; tf_index++) {

    text_frame = textFrames.item(tf_index);

    var create_fabric_copy = false;
    var fabric_copy = [];

    for(x=0; x<text_frame.textStyleRanges.length; x++) {

        target_text = text_frame.textStyleRanges.item(x).texts.item(0);

        character_style = target_text.appliedCharacterStyle.name;
        paragraph_style = target_text.appliedParagraphStyle.name;


        // Overview can contain many text styles. Loop through find the where the Fabric_Bold style is and reset the array.
        // The Fabric copy will follow
        if (paragraph_style == 'Overview') {

            if (create_fabric_copy) {
                fabric_copy.push(target_text.contents);
            }

            if (character_style == 'Fabric_Bold' && !create_fabric_copy) {
                create_fabric_copy = true;
            }
        }

        if (create_fabric_copy) {
            character_style_texts['fabric_copy'] = fabric_copy.join(' ');
        }

        character_style_texts[character_style] = target_text;
        paragraph_style_texts[paragraph_style] = target_text;
    }
}

var output = new File('~/Devel/patagonia/2014_workbook_automation/script_output/output.txt');
output.encoding = "UTF-8";
output.open('w');
output.writeln(character_style_texts['Product Number'].contents)
output.writeln(paragraph_style_texts['Overview'].contents);
output.writeln(paragraph_style_texts['Overview'].contents);
output.writeln()
output.close();

alert('go: ' + character_style_texts['fabric_copy']);


