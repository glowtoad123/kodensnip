import React from 'react'
import styles from '../styles/edit.module.css'

export default function Languages(props: any) {





    return (
        <select onClick={props.set}  className="select">
            <option className="option" value={props.default && props.default !== "javascript" ? props.default  : "javascript"}>{props.default && props.default !== "javascript" ? props.default  : "javascript"}</option>
            <option className={styles.monacoSupport} value="batch">Batch</option>
            <option className={styles.monacoSupport} value="coffeescript">CoffeeScript</option>
            <option className={styles.intellisense} value="css">CSS</option>
            <option className={styles.monacoSupport} value="cpp">C++</option>
            <option className={styles.monacoSupport} value="csharp">C#</option>
            <option className={styles.monacoSupport} value="dart">Dart</option>
            <option className={styles.monacoSupport} value="diff">Diff</option>
            <option className="option" value="django">django</option>
            <option className="option" value="dockerfile">dockerfile</option>
            <option className={styles.monacoSupport} value="fsharp">F#</option>
            <option className="option" value="go">go</option>
            <option className={styles.monacoSupport} value="handlebars">Handlebars</option>
            <option className={styles.intellisense} value="html">HTML</option>
            <option className={styles.monacoSupport} value="java">Java</option>
            <option className={styles.intellisense} value="javascript">JavaScript</option>
            <option className={styles.intellisense} value="json">JSON</option>
            <option className={styles.intellisense} value="less">LESS</option>
            <option className={styles.monacoSupport} value="lua">Lua</option>
            <option className={styles.monacoSupport} value="markdown">Markdown</option>
            <option className={styles.monacoSupport} value="objective-c">Objective-C</option>
            <option className="option" value="perl">perl</option>
            <option className={styles.monacoSupport} value="php">PHP</option>
            <option className={styles.monacoSupport} value="powershell">Powershell</option>
            <option className={styles.monacoSupport} value="pug">Pug</option>
            <option className={styles.monacoSupport} value="python">Python</option>
            <option className={styles.monacoSupport} value="r">R</option>
            <option className={styles.monacoSupport} value="razor">Razor</option>
            <option className={styles.monacoSupport} value="ruby">Ruby</option>
            <option className={styles.monacoSupport} value="sass">SASS</option>
            <option className={styles.intellisense} value="scss">SCSS</option>
            <option className="option" value="sql">sql</option>
            <option className="option" value="swift">swift</option>
            <option className={styles.intellisense} value="typescript">TypeScript</option>
            <option className={styles.monacoSupport} value="vb">VB</option>
            <option className="option" value="vue">vue</option>
            <option className={styles.monacoSupport} value="xml">XML</option>
        </select>
    )
}