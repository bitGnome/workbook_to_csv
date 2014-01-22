document = app.activeDocument;

var output = new File('~/Devel/patagonia/2014_workbook_automation/script_output/output.txt');
output.encoding = "UTF-8";
output.open('w');

textFrames = document.textFrames

for(tf_index=0;tf_index<textFrames.length; tf_index++) {

    text_frame = textFrames.item(tf_index);

    for (var x=0; x<text_frame.paragraphs.length; x++) {
        paragraph = text_frame.paragraphs.item(x);
        if (paragraph.appliedParagraphStyle.name == 'Overview') {
            // Get the code from workbook_to_csv for looping through textStyleRanges
            output.writeln(paragraph.contents);
        }

        if (paragraph.appliedParagraphStyle.name == 'Features') {
            revised = paragraph.appliedCharacterStyle.name == 'feature_revised' ? true : false
            output.writeln(revised + ' : ' + paragraph.contents);
        }
    }
}

output.close();