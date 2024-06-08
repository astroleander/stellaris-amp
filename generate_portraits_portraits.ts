import fs from 'node:fs';
import { checkbox } from "@inquirer/prompts";

const portraitSeries = fs.readdirSync('./anime_mechanical_portriats/gfx/models/portraits');

const selectedPortraits = await checkbox({
  message: "Select the scripts to run",
  choices: portraitSeries.map((portrait) => ({
    name: portrait,
    value: portrait,
  })),
});
console.log(selectedPortraits);
selectedPortraits.forEach((portrait) => {
  const portraitFiles = fs.readdirSync(`./anime_mechanical_portriats/gfx/models/portraits/${portrait}`);
  const list = portraitFiles.map((file, idx) => {
    const portraitFilePath = `gfx/models/portraits/${portrait}/${file}`;
    const name = `${portrait}_${(idx+1).toString().padStart(3, '0')}`;
    return {
      path: portraitFilePath,
      name,
    };
  });
  const newContent = `
portraits = {
${list.map(({ path, name }) => `  ${name} = { texturefile = "${path}" }`).join('\n')}
}
portrait_groups = {
  ${portrait} = {
    default = ${list?.[0]?.name}
${['game_setup', 'species', 'pop', 'leader', 'ruler'].map((cat) => `  ${cat} = {
    add = {
      portraits = {
${list.map(({ name }) => `        ${name}`).join('\n')}
        }
      }
    }`).join('\n')}
  }
}
`;
  const newFile = `anime_mechanical_portriats/gfx/portraits/portraits/${portrait}.txt`;
  fs.writeFileSync(newFile, newContent);
})