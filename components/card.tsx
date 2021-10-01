import React from 'react'
import styles from '../styles/dash.module.css'
import dynamic from 'next/dynamic';
import Link from "next/link"

const CodeMirror: any = dynamic(async () => {
    await import('codemirror/mode/apl/apl')
    await import('codemirror/mode/asciiarmor/asciiarmor')
    await import('codemirror/mode/asn.1/asn.1')
    await import('codemirror/mode/asterisk/asterisk')
    await import('codemirror/mode/brainfuck/brainfuck')
    await import('codemirror/mode/clike/clike')
    await import('codemirror/mode/clojure/clojure')
    await import('codemirror/mode/cmake/cmake')
    await import('codemirror/mode/cobol/cobol')
    await import('codemirror/mode/coffeescript/coffeescript')
    await import('codemirror/mode/commonlisp/commonlisp')
    await import('codemirror/mode/crystal/crystal')
    await import('codemirror/mode/css/css')
    await import('codemirror/mode/cypher/cypher')
    await import('codemirror/mode/d/d')
    await import('codemirror/mode/dart/dart')
    await import('codemirror/mode/diff/diff')
    await import('codemirror/mode/django/django')
    await import('codemirror/mode/dockerfile/dockerfile')
    await import('codemirror/mode/dtd/dtd')
    await import('codemirror/mode/dylan/dylan')
    await import('codemirror/mode/ebnf/ebnf')
    await import('codemirror/mode/ecl/ecl')
    await import('codemirror/mode/eiffel/eiffel')
    await import('codemirror/mode/elm/elm')
    await import('codemirror/mode/erlang/erlang')
    await import('codemirror/mode/factor/factor')
    await import('codemirror/mode/fcl/fcl')
    await import('codemirror/mode/forth/forth')
    await import('codemirror/mode/fortran/fortran')
    await import('codemirror/mode/gas/gas')
    await import('codemirror/mode/gfm/gfm')
    await import('codemirror/mode/gherkin/gherkin')
    await import('codemirror/mode/go/go')
    await import('codemirror/mode/groovy/groovy')
    await import('codemirror/mode/haml/haml')
    await import('codemirror/mode/handlebars/handlebars')
    await import('codemirror/mode/haskell/haskell')
    await import('codemirror/mode/haskell-literate/haskell-literate')
    await import('codemirror/mode/haxe/haxe')
    await import('codemirror/mode/htmlembedded/htmlembedded')
    await import('codemirror/mode/xml/xml')
    await import('codemirror/mode/javascript/javascript')
    await import('codemirror/mode/markdown/markdown')
    await import('codemirror/mode/perl/perl')
    await import('codemirror/mode/php/php')
    await import('codemirror/mode/python/python')
    await import('codemirror/mode/ruby/ruby')
    await import('codemirror/mode/swift/swift')
    await import('codemirror/mode/vue/vue')
    await import('codemirror/mode/markdown/markdown')
    try {
        const theModule: any = await import('react-codemirror2');
        return await theModule.UnControlled;
    } catch (error) {
        return console.log(error);
    }
}, {ssr: false})


export default function Card(props: any) {
    return (
        <div className={styles.card}>
            <Link href={`/snippet?id=${props.id}`} passHref>
                <div className={styles.titleBackground}>
                    <h1>{props.title}</h1>
                </div>
            </Link>
            {props && 
            <CodeMirror
                value={props.code}
                 options={{
                     theme: 'material-ocean',
                     lineNumbers: true,
                     mode: props.language
                }}
            />}
            <div className={styles.controls}>
                <Link href={`/edit?id=${props.id}`} passHref>
                    <img src="/pencil.svg" alt="edit" />
                </Link>
                <img src="/trash.svg" alt="delete" onClick={() => props.delete(props.id, props.index)} />
            </div>             
            
            {/* <Editor
                height="40vh"
                defaultLanguage="javascript"
                defaultValue={props.code}
                theme="vs-dark"
                options={{ readOnly: true }}
            /> */}
        </div>
    )
}
