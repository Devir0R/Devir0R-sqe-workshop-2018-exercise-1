import * as esprima from 'esprima';

import escodegen from 'escodegen';

var if_else_flag = false;
const parseCode = (codeToParse) => {
    return decomposeToStructures(esprima.parseScript(codeToParse,{ loc: true }));
};//

export {parseCode};

function decomposeToStructures(parsedCode) {
    let l = progHandle(parsedCode);
    return l;
}//

function makeStruct(type,name,cond,val,line) {
    return {
        Type: type,
        Name: name,
        Condition: cond,
        Value: val,
        Line:line
    };
}//


function ifElseFlagHandle(node) {
    if (node.alternate != null) {
        if (node.alternate.type.includes('IfStatement'))
            if_else_flag = true;
    }
}//

function handleComplexStructures(node, ans) {
    if (node.type.includes('IfStatement')) {
        ans.push(ifHandle(node));
        ifElseFlagHandle(node);
    }
    else {
        if (handleLoops(node,ans)){
            return;
        }
        else if (node.type.includes('FunctionDeclaration')) {
            ans.push(funcHandle(node));
            for (var j = 0; j < node.params.length; j++)
                ans.push(funcParamsHandle(node.params[j]));
        }
    }
}//

function handleLoops(node,ans){
    if (node.type.includes('WhileStatement')) {
        ans.push(whileHandle(node));
        return true;
    }
    else if (node.type.includes('ForStatement')) {
        ans.push(forHandle(node));
        return true;
    }
    else if (node.type.includes('ForInStatement')) {
        ans.push(forInHandle(node));
        return true;
    }
    return false;
}//

function handleTypes(node, ans) {
    if (node.type.includes('VariableDeclarator')) {
        ans.push(varHandle(node));
    }
    else if (node.type.includes('AssignmentExpression')) {
        ans.push(expHandle(node));
    }
    else if (node.type.includes('ReturnStatement')) {
        ans.push(retHandle(node));
    }
    else {
        handleComplexStructures(node, ans);
    }
}//

function progHandle(parsed){
    let ans = [];
    traverse(parsed,function (node) {
        if(node.type === undefined) {
            return ans;
        }
        handleTypes(node, ans);
    });
    return ans;
}//


function funcParamsHandle(par){
    return makeStruct('variable declaration',par.name,'','',getLine(par));
}//

function funcHandle(node){
    return makeStruct('function declaration',node.id.name,'','',getLine(node));
}//

function retHandle(node){
    return makeStruct('return statement','','',escodegen.generate(node.argument),getLine(node));
}//

function ifHandle(node){
    if(if_else_flag){
        if_else_flag = false;
        return makeStruct('else if statement','',escodegen.generate(node.test),'',getLine(node));
    }
    return makeStruct('if statement','',escodegen.generate(node.test),'',getLine(node));
}//

function forHandle(node){
    return makeStruct('for statement','',escodegen.generate(node.test),'',getLine(node));
}//

function forInHandle(node){
    return makeStruct('for in statement','','','',getLine(node));
}//

function whileHandle(node){
    return makeStruct(node.type.includes('Do')? 'do-while statement': 'while statement',
        '',
        escodegen.generate(node.test),
        '',getLine(node));
}//

function getLine(node) {
    return node.loc.start.line;
}//

function expHandle(node){
    return makeStruct('assignment expression',node.left.name,'',escodegen.generate(node.right),getLine(node));
}//

function varHandle(node){
    return makeStruct('variable declaration',node.id.name,'',node.init==null? '': node.init.value,getLine(node));
}//

function traverseChildren(child, func) {
    if (Array.isArray(child)) {
        for (const node of child) { //5
            traverse(node, func);
        }
    } else {
        traverse(child, func); //6
    }
}

function traverse(node, func) {
    func(node);//1
    for (var key in node) { //2
        if (node.hasOwnProperty(key)) { //3
            var child = node[key];
            if (typeof child === 'object' && child !== null) { //4
                traverseChildren(child, func);
            }
        }
    }
}


