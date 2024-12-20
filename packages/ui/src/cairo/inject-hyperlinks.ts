import { contractsVersionTag } from "@openzeppelin/wizard-cairo/src";

export function injectHyperlinks(code: string) {
  const importRegex = /use<\/span> (openzeppelin)::([^\s]*);/g
  let result = code;
  let match = importRegex.exec(code);
  while (match != null) {
    const [line, libraryPrefix, libraryPath] = match;
    if (line !== undefined && libraryPrefix !== undefined && libraryPath !== undefined) {
      const githubPrefix = `https://github.com/OpenZeppelin/cairo-contracts/blob/${contractsVersionTag}/packages/`;

      let libraryPathSegments = libraryPath.split('::');
      libraryPathSegments.splice(1, 0, 'src');

      removeComponentName(libraryPathSegments);

      if (libraryPathSegments !== undefined && libraryPathSegments.length > 0) {
        const replacedImportLine = `use<\/span> <a class="import-link" href='${githubPrefix}${libraryPathSegments.join('/')}.cairo' target='_blank' rel='noopener noreferrer'>${libraryPrefix}::${libraryPath}</a>;`;
        result = result.replace(line, replacedImportLine);
      }
    }
    match = importRegex.exec(code);
  }
  return result;
}

const componentMappings: { [key: string]: string } = {
  'AccountComponent': 'account',
  'UpgradeableComponent': 'upgradeable',
} as const;

function removeComponentName(libraryPathSegments: Array<string>) {
  const lastItem = libraryPathSegments[libraryPathSegments.length - 1];
  if (lastItem !== undefined && componentMappings[lastItem] !== undefined) {
    // Replace component name with the name of its .cairo file
    libraryPathSegments.splice(-1, 1, componentMappings[lastItem] as string);
  } else {
    libraryPathSegments.pop();
  }
}
