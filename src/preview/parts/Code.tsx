import { useSignal } from '@preact/signals';
import {
  CSSProperties,
  PropsWithChildren,
  ReactNode,
  useLayoutEffect,
} from 'preact/compat';
import { SyntaxTokens } from '../../state/tokens.ts';
import {
  cssVarStyleToken,
  cssVarSyntaxColorToken,
  cssVarSyntaxStyleToken,
  cssVarSyntaxWeightToken,
} from '../../utils/cssVarTokens.ts';

const EXTRA_LINES = 10;

type SNProps = PropsWithChildren<{ s: SyntaxTokens }>;

const SN = (props: SNProps) => {
  return (
    <span
      data-attribute={'syntax.' + props.s}
      style={{
        color: cssVarSyntaxColorToken(props.s),
        fontStyle: cssVarSyntaxStyleToken(props.s),
        fontWeight: cssVarSyntaxWeightToken(props.s),
      }}
    >
      {props.children}
    </span>
  );
};

const Popup = (
  props: PropsWithChildren<{ style: CSSProperties; content: ReactNode }>
) => {
  const show = useSignal(false);
  return (
    <span class="relative">
      <span
        onMouseEnter={() => (show.value = true)}
        onMouseLeave={() => (show.value = false)}
      >
        {props.children}
      </span>
      {show.value && (
        <div
          style={props.style}
          class="absolute left-0 top-[-36px] text-nowrap rounded border p-1"
        >
          {props.content}
        </div>
      )}
    </span>
  );
};

const SP = () => <span>&nbsp;</span>;
const Indent = () => (
  <>
    <SP />
    <SP />
  </>
);
const LA = () => <SN s="keyword">&#60;</SN>;
const LAF = () => <SN s="keyword">&#60;&#47;</SN>;
const RA = () => <SN s="keyword">&#62;</SN>;
const LB = () => <SN s="punctuation.bracket">&#123;</SN>;
const RB = () => <SN s="punctuation.bracket">&#125;</SN>;
const LP = () => <SN s="punctuation.bracket">&#40;</SN>;
const RP = () => <SN s="punctuation.bracket">&#41;</SN>;

const ACTIVE_ROW = 10;

const lines = [
  <div>
    <span
      style={{
        textDecorationLine: 'underline',
        textDecorationStyle: 'wavy',
        textDecorationColor: cssVarStyleToken('error'),
      }}
    >
      <SN s="keyword">import</SN>
      <SP />
      <SN s="variable">fs</SN>
      <SP />
      <SN s="keyword">from</SN>
      <SP />
      <SN s="string">"fs"</SN>
      <SN s="punctuation.delimiter">;</SN>
    </span>
    <br />
    <span
      style={{
        color: cssVarStyleToken('error'),
      }}
    >
      'fs' is declared but its value is never read.
    </span>
  </div>,
  <SN s="comment">&#47;&#47; simple comment</SN>,
  <SN s="comment.doc">
    &#47;** @param &#123;string&#125; a block comment **&#47;
  </SN>,
  <span>
    <SN s="keyword">type</SN>
    <SP />
    <SN s="type">Prop</SN>
    <SP />
    <SN s="operator">=</SN>
    <SP />
    <LB />
    <SP />
    <SN s="property">a</SN>
    <SN s="punctuation.delimiter">;</SN>
    <SP />
    <SN s="type">boolean</SN>
    <SN s="punctuation.delimiter">;</SN>
    <SP />
    <SN s="property">b</SN>
    <SN s="punctuation.delimiter">:</SN>
    <SP />
    <SN s="constant">null</SN>
    <SN s="punctuation.delimiter">;</SN>
    <SP />
    <SN s="property">c</SN>
    <SN s="punctuation.delimiter">:</SN>
    <SP />
    <SN s="type">string</SN>
    <SP />
    <RB />
    <SN s="punctuation.delimiter">;</SN>
  </span>,
  <span>
    <SN s="keyword">enum</SN>
    <SP />
    <SN s="type">
      <Popup
        style={{
          color: cssVarStyleToken('error'),
          backgroundColor: cssVarStyleToken('error.background'),
          borderColor: cssVarStyleToken('error.border'),
        }}
        content="'Enum' is declared but never used."
      >
        <span
          style={{
            textDecorationLine: 'underline',
            textDecorationStyle: 'wavy',
            textDecorationColor: cssVarStyleToken('error'),
          }}
        >
          Enum
        </span>
      </Popup>
    </SN>
    <SP />
    <LB />
    <SP />
    <SN s="property">zed</SN>
    <SP />
    <SN s="operator">=</SN>
    <SP />
    <SN s="string">'zed'</SN>
    <SP />
    <RB />
  </span>,
  <span>
    <SN s="keyword">const</SN>
    <SP />
    <SN s="variable">number</SN>
    <SP />
    <SN s="operator">=</SN>
    <SP />
    <SN s="number">1</SN>
    <SN s="punctuation.delimiter">;</SN>
  </span>,
  <span>
    <SN s="keyword">const</SN>
    <SP />
    <SN s="variable">string</SN>
    <SP />
    <SN s="operator">=</SN>
    <SP />
    <Popup
      style={{
        color: cssVarStyleToken('warning'),
        backgroundColor: cssVarStyleToken('warning.background'),
        borderColor: cssVarStyleToken('warning.border'),
      }}
      content={'Typo in the word "strig"'}
    >
      <span
        style={{
          textDecorationLine: 'underline',
          textDecorationStyle: 'wavy',
          textDecorationColor: cssVarStyleToken('warning'),
        }}
      >
        <SN s="string">"strig"</SN>
      </span>
    </Popup>

    <SN s="punctuation.delimiter">;</SN>
  </span>,
  <span>
    <SN s="keyword">const</SN>
    <SP />
    <SN s="variable">boolean</SN>
    <SP />
    <SN s="operator">=</SN>
    <SP />
    <SN s="boolean">true</SN>
    <SN s="punctuation.delimiter">;</SN>
  </span>,
  <span>
    <SN s="keyword">const</SN>
    <SP />
    <SN s="variable">object</SN>
    <SP />
    <SN s="operator">=</SN>
    <SP />
    <LB />
    <SP />
    <SN s="property">id</SN>
    <SN s="punctuation.delimiter">:</SN>
    <SP />
    <SN s="string">`</SN>
    <SN s="punctuation.special">$&#123;</SN>
    <SN s="variable">string</SN>
    <SN s="punctuation.special">&#125;</SN>
    <SN s="string">_id1`</SN>
    <SP />
    <RB />
    <SP />
    <SN s="punctuation.delimiter">;</SN>
  </span>,
  <span>
    <SN s="keyword">const</SN>
    <SP />
    <SN s="variable">regex</SN>
    <SP />
    <SN s="operator">=</SN>
    <SP />
    <SN s="operator">/</SN>
    <SN s="string.regex">(L^\d]string).*</SN>
    <SN s="operator">/</SN>
    <SN s="string.regex">i</SN>
    <SN s="punctuation.delimiter">;</SN>
  </span>,
  <span class="flex">
    <SN s="keyword">export</SN>
    <SP />
    <SN s="keyword">default</SN>
    <SP />
    <SN s="keyword">function</SN>
    <SP />
    <SN s="type">App</SN>
    <SN s="keyword">
      <LA />
    </SN>
    <SN s="type">T</SN>
    <SP />
    <SN s="keyword">extends</SN>
    <SP />
    <SN s="type">Prop</SN>
    <SP />
    <SN s="operator">=</SN>
    <SP />
    <SN s="type">object</SN>
    <SN s="keyword">
      <RA />
    </SN>
    <LP />
    <SN s="variable">p</SN>
    <SN s="punctuation.delimiter">:</SN>
    <SP />
    <SN s="type">T</SN>
    <RP />
    <SN s="punctuation.delimiter">:</SN>
    <SP />
    <SN s="type">any</SN>
    <SP />
    <LB />
    <SP />
    <span
      class="blink h-full"
      style={{
        backgroundColor: cssVarStyleToken('text.accent'),
        width: '2px',
      }}
    />
  </span>,
  <span>
    <Indent />
    <SN s="keyword">if</SN>
    <SP />
    <LP />
    <SN s="variable">p</SN>
    <SP />
    <SN s="operator">==</SN>
    <SP />
    <SN s="boolean">true</SN>
    <RP />
    <SP />
    <SN s="keyword">return</SN>
    <SP />
    <SN s="constant">null</SN>
    <SN s="punctuation.delimiter">;</SN>
  </span>,
  <span>
    <Indent />
    <SN s="keyword">return</SN>
    <SP />
    <LP />
  </span>,
  <span>
    <Indent />
    <Indent />
    <LA />
    <SN s="tag">div</SN>
    <SP />
    <SN s="attribute">className</SN>
    <SN s="keyword">=</SN>
    <SN s="string">"class1"</SN>
    <SP />
    <SN s="attribute">style</SN>
    <SN s="keyword">=</SN>
    <LB />
    <LB />
    <SP />
    <SN s="property">test</SN>
    <SN s="punctuation.delimiter">:</SN>
    <SP />
    <SN s="number">1</SN>
    <SP />
    <RB />
    <RB />
    <RA />
  </span>,
  <span>
    <Indent />
    <Indent />
    <Indent />
    hello world
    <SP />
    <LB />
    <SN s="variable">p</SN>
    <SN s="punctuation.delimiter">.</SN>
    <SN s="property">name</SN>
    <RB />!
  </span>,
  <span>
    <Indent />
    <Indent />
    <LAF />
    <SN s="tag">div</SN>
    <RA />
  </span>,
  <span>
    <Indent />
    <RP />
  </span>,
  <span>
    <RB />
    <SN s="punctuation.delimiter">;</SN>
  </span>,
  <span>
    <SN s="keyword">class</SN>
    <SP />
    <SN s="type">
      <Popup
        style={{
          color: cssVarStyleToken('error'),
          backgroundColor: cssVarStyleToken('error.background'),
          borderColor: cssVarStyleToken('error.border'),
        }}
        content="'Test' is declared but never used."
      >
        <span
          style={{
            textDecorationLine: 'underline',
            textDecorationStyle: 'wavy',
            textDecorationColor: cssVarStyleToken('error'),
          }}
        >
          Test
        </span>
      </Popup>
    </SN>
    <SP />
    <LB />
  </span>,
  <span>
    <Indent />
    <SN s="keyword">private</SN>
    <SP />
    <SN s="keyword">readonly</SN>
    <SP />
    <SN s="variable">name</SN>
    <SN s="punctuation.delimiter">:</SN>
    <SP />
    <SN s="type">string</SN>
    <SN s="punctuation.delimiter">;</SN>
  </span>,
  <span>
    <Indent />
    <SN s="function.method">constructor</SN>
    <LP />
    <SN s="variable">name</SN>
    <SN s="punctuation.delimiter">:</SN>
    <SP />
    <SN s="type">string</SN>
    <RP />
    <SP />
    <SN s="type">void</SN>
    <SP />
    <LB />
  </span>,
  <span>
    <Indent />
    <Indent />
    <SN s="variable.special">this</SN>
    <SN s="punctuation.delimiter">.</SN>
    <SN s="variable">name</SN>
    <SN s="punctuation.delimiter">;</SN>
  </span>,
  <span>
    <Indent />
    <RB />
  </span>,
  '',
  <span>
    <Indent />
    <SN s="constructor">@guard</SN>
    <LP />
    <LB />
    <SN s="property">description</SN>
    <SN s="punctuation.delimiter">:</SN>
    <SP />
    <SN s="string">'Gets name'</SN>
    <SP />
    <RB />
    <RP />
  </span>,
  <span>
    <Indent />
    <SN s="keyword">public</SN>
    <SP />
    <SN s="function.method">getName</SN>
    <LP />
    <RP />
    <SP />
    <LB />
  </span>,
  <span>
    <Indent />
    <Indent />
    <SN s="keyword">return</SN>
    <SP />
    <SN s="variable.special">this</SN>
    <SN s="punctuation.delimiter">.</SN>
    <SN s="variable">name</SN>
    <SN s="punctuation.delimiter">;</SN>
  </span>,
  <span>
    <Indent />
    <RB />
  </span>,
  <span>
    <RB />
  </span>,
  '',
];

export function Code() {
  const top = useSignal(0);

  const onScroll = (e: Event) => {
    const el = e.target as HTMLDivElement;
    top.value = Math.ceil((el.scrollTop / el.scrollHeight) * el.clientHeight);
  };

  return (
    <code
      id="editor-code"
      class="flex overflow-hidden"
      style={{
        fontFamily:
          '"Fira Code", "Roboto Mono", "Source Code Pro", "monospace"',
        '--scrollbar-top': top.value + 'px',
        '--scrollbar-thumb-background': cssVarStyleToken(
          'scrollbar_thumb.background'
        ),
        '--scrollbar-thumb-hover-background': cssVarStyleToken(
          'scrollbar.thumb.hover_background'
        ),
        '--scrollbar-thumb-border': cssVarStyleToken('scrollbar.thumb.border'),
        '--scrollbar-track-background': cssVarStyleToken(
          'scrollbar.track.background'
        ),
        '--scrollbar-track-border': cssVarStyleToken('scrollbar.track.border'),
        color: cssVarStyleToken('text'),
        backgroundColor: cssVarStyleToken('editor.background'),
      }}
    >
      <div
        id="editor-code-scroll"
        class="scrollbar-hide flex flex-1 flex-col overflow-y-scroll"
        onScroll={onScroll}
      >
        <ScrollbarDiffs />
        <div id="scrollbar" />
        {lines.map((code, line) => (
          <div
            class="relative mr-[14px] flex items-start"
            style={{
              backgroundColor:
                line === ACTIVE_ROW
                  ? cssVarStyleToken('editor.active_line.background')
                  : undefined,
            }}
          >
            <div class="git min-w-[6px]">
              <GutterGitDiffs line={line} />
            </div>
            <div class="gutter min-w-[10px]"></div>
            <div
              class="line-number min-w-[25px] text-right"
              style={{
                color: cssVarStyleToken(
                  line === ACTIVE_ROW
                    ? 'editor.active_line_number'
                    : 'editor.line_number'
                ),
              }}
            >
              {line <= lines.length ? line + 1 : ''}
            </div>
            <div class="code flex flex-1 pl-2">{code}</div>
          </div>
        ))}
        {new Array(EXTRA_LINES).fill(1).map(() => (
          <div>&nbsp;</div>
        ))}
      </div>
    </code>
  );
}

const GIT_CREATED = [4, 5, 6];
const GIT_DELETED = [10];
const GIT_MODIFIED = [2, 12, 13, 14, 15];

function GutterGitDiffs({ line }: { line: number }) {
  let backgroundColor;
  if (GIT_CREATED.includes(line)) {
    backgroundColor = cssVarStyleToken('created');
  } else if (GIT_MODIFIED.includes(line)) {
    backgroundColor = cssVarStyleToken('modified');
  } else if (GIT_DELETED.includes(line)) {
    backgroundColor = cssVarStyleToken('deleted');
  }

  return (
    <div class="block h-full w-[6px]" style={{ backgroundColor }}>
      &nbsp;
    </div>
  );
}

function ScrollbarDiffs() {
  return (
    <div class="z-2 absolute bottom-0 right-0 top-0">
      {new Array(lines.length + EXTRA_LINES).fill(1).map((_, line) => (
        <ScrollbarDiffLine line={line} />
      ))}
    </div>
  );
}

function ScrollbarDiffLine({ line }: { line: number }) {
  const scrollbarDiffHeight = useSignal('16px');

  useLayoutEffect(() => {
    const el = document.getElementById('editor-code-scroll');
    if (el) {
      const height = el.clientHeight / (lines.length + EXTRA_LINES);
      scrollbarDiffHeight.value = height + 'px';
    }
  }, []);

  let backgroundColor;
  if (GIT_CREATED.includes(line)) {
    backgroundColor = cssVarStyleToken('created');
  } else if (GIT_MODIFIED.includes(line)) {
    backgroundColor = cssVarStyleToken('modified');
  } else if (GIT_DELETED.includes(line)) {
    backgroundColor = cssVarStyleToken('deleted');
  }

  return (
    <div
      class="block w-[10px]"
      style={{ height: scrollbarDiffHeight.value, backgroundColor }}
    >
      &nbsp;
    </div>
  );
}
