document = app.activeDocument;

// InDesign paragraph style names
spec_line_paragraph_style = 'Spec_Line';
overview_paragraph_style = 'Overview';
features_paragraph_style = 'Features';

// csv header names
product_number_header = 'Product Number';
overview_heaer = 'Workbook Overview';
material_desc_header  = 'Material Description (Edit)';
feature_content_header = 'Workbook Feature';
feature_revised_header = 'Workbook Feature Revised';

field_delimiter = '|';

var output = new File('~/Devel/patagonia/2014_workbook_automation/script_output/output.txt');
output.encoding = "UTF-8";
output.open('w');

textFrames = document.textFrames;

output.write(product_number_header + field_delimiter);
output.write(overview_heaer + field_delimiter)
output.write(material_desc_header + field_delimiter);

for (var i=1; i<8; i++) {
    output.write(feature_content_header + ' ' + i + field_delimiter);
    output.write(feature_revised_header + ' ' + i);
    if (i < 7) { output.write(field_delimiter)}
}

output.write('\n');

for(tf_index=0;tf_index<textFrames.length; tf_index++) {

    var overview_copy = undefined;
    var fabric_copy = undefined;
    var spec_line = {};
    var features = [];

    var text_frame = textFrames.item(tf_index);

    for (var x=0; x<text_frame.paragraphs.length; x++) {
        var paragraph = text_frame.paragraphs.item(x);

        if (paragraph.appliedParagraphStyle.name == overview_paragraph_style) {
            var overview = new OverviewBlock(paragraph);
            overview_copy = squeeze(overview.main_copy);
            fabric_copy = squeeze(overview.fabric_copy);
        } else if (paragraph.appliedParagraphStyle.name == features_paragraph_style) {
            var feature = new FeatureBlock(paragraph);
            features.push(feature.contents + field_delimiter + feature.revised );
        } else if (paragraph.appliedParagraphStyle.name == spec_line_paragraph_style) {
            spec_line = new SpecLine(paragraph);
        }
    }

    if (!isEmpty(spec_line)) {
        output.writeln(spec_line.product_number + field_delimiter + overview_copy + field_delimiter + fabric_copy + field_delimiter + features.join(field_delimiter));
    }
}

output.close();

function SpecLine(paragraph) {

    spec_line = {};
    product_number_character_style = 'Product Number'

    for(var y=0; y<paragraph.textStyleRanges.length; y++) {

        target_text = paragraph.textStyleRanges.item(y).texts.item(0);
        character_style = target_text.appliedCharacterStyle.name;

        if (character_style == product_number_character_style) {
            spec_line.product_number = target_text.contents;
        }
    }

    return spec_line;
}

function OverviewBlock(paragraph) {
    material_desc_character_style = 'material_desc';
    overview = {};
    overview.main_copy = [];
    overview.fabric_copy = [];

    for(var y=0; y<paragraph.textStyleRanges.length; y++) {

        target_text = paragraph.textStyleRanges.item(y).texts.item(0);
        character_style = target_text.appliedCharacterStyle.name;

        if (character_style == '[None]') {
            overview.main_copy.push(target_text.contents.replace(/(\r\n|\n|\r)/gm,""));
        } else if (character_style == material_desc_character_style) {
            overview.fabric_copy.push(target_text.contents.replace(/(\r\n|\n|\r)/gm,""));
        }
    }

    return overview;
}

function FeatureBlock(paragraph) {

    feature_revised_paragraph_style = 'feature_revised';

    parsed_feature = {};

    parsed_feature.revised = paragraph.appliedCharacterStyle.name == feature_revised_paragraph_style ? true : false;
    parsed_feature.contents = paragraph.contents.replace(/(\r\n|\n|\r)/gm,"");

    return parsed_feature;
}

function squeeze(paragraph) {
    return paragraph.join('').replace(/^\s+|\s+$/g,'');
}

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}