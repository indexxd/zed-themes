import Ajv from 'ajv';
import { useRef } from 'preact/hooks';
import { ChangeEvent } from 'react';
import { FileDrop } from 'react-file-drop';
import ExitIcon from '../assets/icons/exit.svg?react';
import ExternalIcon from '../assets/icons/external_link.svg?react';
import { theme, themeFamily } from '../state/state.tsx';
import themeFamilySchema from '../state/themeFamily.json';
import { ThemeFamilyContent } from '../state/themeFamily';
import { SyntaxTokens, syntaxTokens } from '../state/tokens.ts';
import { sections } from './sections.ts';
import { Section } from './Section.tsx';
import { setStyleToken, setSyntaxToken, Token } from './Token.tsx';
import { UIThemeToggle } from './UIThemeToggle.tsx';

const ajv = new Ajv();
const validate = ajv.compile<ThemeFamilyContent>(themeFamilySchema);

export function Side() {
  const fileDropRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onFileInput = (event: ChangeEvent<HTMLInputElement>) => {
    onFiles(event.currentTarget.files);
  };

  const onFiles = (files: FileList | null) => {
    if (files === null || files.length > 1) {
      alert('Please upload only 1 file');
      return;
    }

    const file = files[0];
    if (file.type !== 'application/json') {
      alert('Please upload a JSON file');
      return;
    }

    file.text().then((text) => {
      const data = JSON.parse(text);
      const isThemeFamily = 'author' in data;
      const themeFamily = isThemeFamily
        ? data
        : { author: 'zed', name: 'zed', themes: [data] };

      if (validate(themeFamily)) {
        theme.value = themeFamily.themes[0];
      } else {
        console.warn(validate.errors);
        const message = validate.errors?.map((e) => e.message).join('\n');
        alert(
          `File does not match Zed's theme schema!\n\nWe got the following errors:\n${message}`
        );
      }
    });

    fileDropRef.current?.classList.add('hidden');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const saveTheme = () => {
    const fileName = 'schema';
    const json = JSON.stringify(themeFamily.value, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const href = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = href;
    link.download = fileName + '.json';
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };

  return (
    <>
      <FileDrop
        onTargetClick={() => fileInputRef.current?.click()}
        onFrameDragEnter={() => fileDropRef.current?.classList.remove('hidden')}
        onFrameDragLeave={() => fileDropRef.current?.classList.add('hidden')}
        onDrop={onFiles}
      >
        <div
          ref={fileDropRef}
          class="absolute inset-0 isolate z-10 flex hidden select-none items-center justify-center bg-zinc-600/80"
        >
          <h4 class="text-2xl font-bold text-white shadow-black drop-shadow-lg">
            Drop your schema here
          </h4>
        </div>
      </FileDrop>
      <input
        type="file"
        class="hidden"
        ref={fileInputRef}
        accept=".json"
        multiple={false}
        onChange={onFileInput}
      />
      <div class="flex h-full w-96 flex-col overflow-hidden border-r border-zinc-300 bg-zinc-100 dark:border-neutral-600 dark:bg-neutral-800">
        <div class="flex items-center p-2 text-zed-900">
          <span class="flex-1 select-none pl-1 text-lg font-semibold text-zed-800 dark:text-zed-600">
            Zed Themes
          </span>
          <UIThemeToggle />
        </div>
        <div class="px-2">
          <input
            value={theme.value?.name}
            type="text"
            class="border-1 w-full cursor-pointer rounded border border-solid border-transparent bg-transparent px-1 text-zed-800 outline-none hover:border-zinc-300 hover:bg-zinc-200 focus:border-zinc-400 focus:text-black dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:bg-zinc-800 dark:focus:border-zinc-500 dark:focus:text-white"
            placeholder="name"
            onChange={(e) => {
              if (theme.value) {
                theme.value = {
                  ...theme.value,
                  name: e.currentTarget.value ?? '',
                };
              }
            }}
          />
        </div>
        <div class="flex-1 divide-y divide-neutral-300 overflow-scroll dark:divide-neutral-700">
          {sections.map((section) => (
            <Section name={section.name} tokens={section.tokens}>
              {(token) => (
                <Token
                  name={token.name}
                  color={theme.value?.style[token.token]}
                  description={token.description}
                  onChange={(color) => setStyleToken(token.token, color)}
                />
              )}
            </Section>
          ))}
          <Section name="Syntax" tokens={syntaxTokens as any as SyntaxTokens[]}>
            {(token) => (
              <Token
                name={token}
                color={theme.value?.style.syntax[token]?.color}
                description=""
                onChange={(color) => setSyntaxToken(token, { color })}
                syntax={token}
              />
            )}
          </Section>
        </div>
        <div class="flex select-none flex-col items-stretch divide-y divide-neutral-300 shadow-2xl shadow-black/60 dark:divide-neutral-700 dark:shadow-white/75">
          <button
            onClick={() => fileInputRef.current?.click()}
            class="flex items-center justify-center gap-2 py-3 text-lg font-semibold text-zed-800 hover:bg-neutral-200 hover:text-zed-900 dark:text-zed-600 dark:hover:bg-neutral-700 dark:hover:text-zed-200"
          >
            <ExternalIcon width={16} height={16} />
            <span class="w-[150px] text-left">Upload Theme</span>
          </button>
          <button
            onClick={saveTheme}
            class="flex items-center justify-center gap-2 py-3 text-lg font-semibold text-zed-800 hover:bg-neutral-200 hover:text-zed-900 dark:text-zed-600 dark:hover:bg-neutral-700 dark:hover:text-zed-200"
          >
            <ExitIcon width={16} height={16} />
            <span class="w-[150px] text-left">Save Theme</span>
          </button>
        </div>
      </div>
    </>
  );
}
