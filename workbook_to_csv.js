document = app.activeDocument;

var output = new File('~/Devel/patagonia/2014_workbook_automation/script_output/output.txt');
output.encoding = "UTF-8";
output.open('w');

textFrames = document.textFrames

for(tf_index=0;tf_index<textFrames.length; tf_index++) {

    text_frame = textFrames.item(tf_index);

    var character_style_texts = new Object();
    var paragraph_style_texts = new Object();

    var create_fabric_copy = false;
    var fabric_copy = [];

    var overview_copy = [];

    var feature_blocks = [];

    for(var x=0; x<text_frame.textStyleRanges.length; x++) {

        target_text = text_frame.textStyleRanges.item(x).texts.item(0);

        character_style = target_text.appliedCharacterStyle.name;
        paragraph_style = target_text.appliedParagraphStyle.name;


        // Overview can contain many text styles. Loop through find the where the Fabric_Bold style is and reset the array.
        // The Fabric copy will follow
        if (paragraph_style == 'Overview') {

            if (create_fabric_copy) {
                fabric_copy.push(target_text.contents);
            } else if (character_style != 'Bugs')  {
                overview_copy.push(target_text.contents);
            }

            if (character_style == 'Fabric_Bold' && !create_fabric_copy) {
                create_fabric_copy = true;
                overview_copy.pop();
            }
        }

        if (paragraph_style == 'Features') {
            revised = (character_style == 'feature_revised') ? true : false
            feature_block = new FeatureBlock(target_text.contents, revised);
            feature_blocks.push(feature_block);
        }

        character_style_texts[character_style] = target_text;
        paragraph_style_texts[paragraph_style] = target_text;

    }

    character_style_texts['fabric_copy'] = fabric_copy.join('');
    character_style_texts['overview_copy'] = overview_copy.join('');

    if (character_style_texts['Product Number'] != undefined && overview_copy.length > 0) {
        output.writeln(character_style_texts['Product Number'].contents)
        output.writeln(character_style_texts['overview_copy'].replace(/^\s+|\s+$/g,''));
        output.writeln(character_style_texts['fabric_copy']);

        for (var x = 0; x<feature_blocks.length; x++) {
            output.writeln(feature_blocks[x].revised + ' : ' + feature_blocks[x].contents);
        }

    }
}

output.close();

function FeatureBlock(contents, revised) {
    this.contents = contents;
    this.revised = revised;
}

