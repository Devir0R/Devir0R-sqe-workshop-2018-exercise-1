import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';

function equalArraysNotByOrder(array1,array2){
    return array1.length==array2.length &&
        array2.reduce((accumulator, currentValue) => accumulator && stringifyInArray(array1,currentValue),
            true);
}

function stringifyInArray(arr1,obj){
    for(var i =0;i<arr1.length;i++){
        if(JSON.stringify(obj,null,4) === JSON.stringify(arr1[i],null,4))
            return true;
    }
    //throw "Not Found: " + JSON.stringify(obj,null,4);
    return false;
}

describe('The javascript parser', () => {
    it('is parsing an empty function correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('')),
            '[]'
        );
    });

    it('is parsing a simple variable declaration correctly', () => {
        assert.equal(
            true,
            equalArraysNotByOrder(parseCode('let a = 1;'),
                [{Type:"variable declaration",Name:"a",Condition:"",Value:1,Line:1}])
        );
    });

    it('is parsing a simple variable declaration correctly', () => {
        assert.equal(
            true,
            equalArraysNotByOrder(parseCode('let a;'),
                [{Type:"variable declaration",Name:"a",Condition:"",Value:"",Line:1}])
        );
    });

    it('is parsing a simple variable declaration correctly', () => {
        assert.equal(
            true,
            equalArraysNotByOrder(parseCode('var a = 1;'),
                [{Type:"variable declaration",Name:"a",Condition:"",Value:1,Line:1}])
        );
    });


    it('is parsing an assignment expression with function call correctly', () => {
        assert.equal(
            true,
            equalArraysNotByOrder(parseCode('a = foo(1);'),
                [{Type:"assignment expression",Name:"a",Condition:"",Value:"foo(1)",Line:1}])
        );
    });


    it('is parsing a assignment expression correctly', () => {
        assert.equal(
            true,
            equalArraysNotByOrder(parseCode('a = 1;'),
                [{Type:"assignment expression",Name:"a",Condition:"",Value:"1",Line:1}])
        );
    });

    it('is parsing a assignment expression correctly', () => {
        assert.equal(
            true,
            equalArraysNotByOrder(parseCode("a = '1';"),
                [{Type:"assignment expression",Name:"a",Condition:"",Value:"'1'",Line:1}])
        );
    });

    it('is parsing a if statement declaration correctly', () => {
        assert.equal(
            true,
            equalArraysNotByOrder(parseCode('if(a == 1)a=a+1;'),
                [{Type:"if statement",Name:"",Condition:"a == 1",Value:"",Line:1}
                    ,{Type:"assignment expression",Name:"a",Condition:"",Value:"a + 1",Line:1}])
        );
    });

    it('is parsing a while statement declaration correctly', () => {
        assert.equal(
            true,
            equalArraysNotByOrder(parseCode('while(a == 1)a=a+1;'),
                [{Type:"while statement",Name:"",Condition:"a == 1",Value:"",Line:1}
                    ,{Type:"assignment expression",Name:"a",Condition:"",Value:"a + 1",Line:1}])
        );
    });



    it('is parsing a do-while statement declaration correctly', () => {
        assert.equal(
            true,
            equalArraysNotByOrder(parseCode('do{a=a+1;}while(a == 1);'),
                [{Type:"do-while statement",Name:"",Condition:"a == 1",Value:"",Line:1}
                    ,{Type:"assignment expression",Name:"a",Condition:"",Value:"a + 1",Line:1}])
        );
    });

    it('is parsing a for statement declaration correctly', () => {
        assert.equal(
            true,
            equalArraysNotByOrder(parseCode('for(;a == 1;)a=a+1;'),
                [{Type:"for statement",Name:"",Condition:"a == 1",Value:"",Line:1}
                    ,{Type:"assignment expression",Name:"a",Condition:"",Value:"a + 1",Line:1}])
        );
    });

    it('is parsing a for in statement declaration correctly', () => {
        assert.equal(
            true,
            equalArraysNotByOrder(parseCode('for(x in s)a=a+1;'),
                [{Type:"for in statement",Name:"",Condition:"",Value:"",Line:1}
                    ,{Type:"assignment expression",Name:"a",Condition:"",Value:"a + 1",Line:1}])
        );
    });

    it('is parsing a function declaration declaration correctly', () => {
        assert.equal(
            true,
            equalArraysNotByOrder(parseCode('function foo(x)\n{\nreturn x+1;\n}'),
                [{Type:"function declaration",Name:"foo",Condition:"",Value:"",Line:1}
                    ,{Type:"variable declaration",Name:"x",Condition:"",Value:"",Line:1}
                    ,{Type:"return statement",Name:"",Condition:"",Value:"x + 1",Line:3}])
        );
    });

    it('is parsing a function declaration declaration correctly', () => {
        assert.equal(
            true,
            equalArraysNotByOrder(parseCode('function foo(x,y,z)\n{\nreturn x+y+z;\n}'),
                [{Type:"function declaration",Name:"foo",Condition:"",Value:"",Line:1}
                    ,{Type:"variable declaration",Name:"x",Condition:"",Value:"",Line:1}
                    ,{Type:"variable declaration",Name:"y",Condition:"",Value:"",Line:1}
                    ,{Type:"variable declaration",Name:"z",Condition:"",Value:"",Line:1}
                    ,{Type:"return statement",Name:"",Condition:"",Value:"x + y + z",Line:3}])
        );
    });

    it('is parsing a else-if statement declaration correctly', () => {
        assert.equal(
            true,
            equalArraysNotByOrder(parseCode(
                'if(a == 1)\n' +
                'a=a+1;\n' +
                'else if(a!=2)\n' +
                'a=2;'),
                [{Type:"if statement",Name:"",Condition:"a == 1",Value:"",Line:1}
                    ,{Type:"assignment expression",Name:"a",Condition:"",Value:"a + 1",Line:2}
                    ,{Type:"else if statement",Name:"",Condition:"a != 2",Value:"",Line:3}
                    ,{Type:"assignment expression",Name:"a",Condition:"",Value:"2",Line:4}])
        );
    });

    it('is parsing a else-if statement with else statement declaration correctly', () => {
        assert.equal(
            true,
            equalArraysNotByOrder(parseCode(
                'if(a == 1)\n' +
                'a=a+1;\n' +
                'else if(a!=2)\n' +
                'a=2;\n' +
                'else\n' +
                'a=a-1;'),
                [{Type:"if statement",Name:"",Condition:"a == 1",Value:"",Line:1}
                    ,{Type:"assignment expression",Name:"a",Condition:"",Value:"a + 1",Line:2}
                    ,{Type:"else if statement",Name:"",Condition:"a != 2",Value:"",Line:3}
                    ,{Type:"assignment expression",Name:"a",Condition:"",Value:"2",Line:4}
                    ,{Type:"assignment expression",Name:"a",Condition:"",Value:"a - 1",Line:6}])
        );
    });

});
