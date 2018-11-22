import $ from 'jquery';
import {parseCode} from './code-analyzer';
import {tree} from './code-analyzer';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let structures = parseCode(codeToParse);
        $('#parsedCode').val(JSON.stringify(tree(codeToParse), null, 2));
        var head = '            <thead>\n' +
            '            <tr>\n' +
            '                <th>Line</th>\n' +
            '                <th>Type</th>\n' +
            '                <th>Name</th>\n' +
            '                <th>Condition</th>\n' +
            '                <th>Value</th>\n' +
            '            </tr>\n' +
            '            </thead>';
        document.getElementById('structure_table').innerHTML = head + createInnerHtml(structures);
    });
});


function createInnerHtml(structures) {
    let ans = '';
    for(var i=0;i< structures.length;i++){
        ans +='            <tbody>\n' +
            '            <tr>\n' +
            '                <td>' + structures[i].Line +'</td>\n' +
            '                <td>' + structures[i].Type +'</td>\n' +
            '                <td>' + structures[i].Name +'</td>\n' +
            '                <td>' + structures[i].Condition +'</td>\n' +
            '                <td>' + structures[i].Value +'</td>\n' +
            '            </tr>\n' +
            '            </tbody>';
    }
    return ans;
}
