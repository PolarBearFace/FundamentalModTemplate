import { assignHotkeys, detectShift, removeHotkey } from './Hotkeys';
import { deepClone, getId, getQuery, globalSaveStart, pauseGame, loadGame } from './Main';
import { global, player } from './Player';
import { assignResetInformation } from './Stage';
import type { globalSaveType, hotkeysList, numbersList } from './Types';
import { format, numbersUpdate, stageUpdate, switchTab, visualTrueStageUnlocks, visualUpdate } from './Update';

export const globalSave: globalSaveType = {
    intervals: {
        offline: 20,
        numbers: 80,
        visual: 800,
        autoSave: 20000
    },
    hotkeys: {
        makeAll: ['M', 'M'],
        toggleAll: ['Shift A', 'Shift A'],
        createAll: ['U', 'U'],
        toggleUpgrades: ['None', 'None'],
        discharge: ['D', 'D'],
        toggleDischarge: ['None', 'None'],
        vaporization: ['V', 'V'],
        toggleVaporization: ['None', 'None'],
        rank: ['R', 'R'],
        toggleRank: ['None', 'None'],
        collapse: ['C', 'C'],
        toggleCollapse: ['None', 'None'],
        galaxy: ['G', 'G'],
        merge: ['Shift M', 'Shift M'],
        toggleMerge: ['None', 'None'],
        nucleation: ['N', 'N'],
        toggleNucleation: ['None', 'None'],
        stage: ['S', 'S'],
        toggleStage: ['None', 'None'],
        universe: ['Shift U', 'Shift U'],
        end: ['Shift B', 'Shift B'],
        exitChallenge: ['Shift E', 'Shift E'],
        supervoid: ['Shift S', 'Shift S'],
        warp: ['Shift W', 'Shift W'],
        pause: ['P', 'P'],
        tabRight: ['Arrow Right', 'Arrow Right'],
        tabLeft: ['Arrow Left', 'Arrow Left'],
        subtabUp: ['Arrow Up', 'Arrow Up'],
        subtabDown: ['Arrow Down', 'Arrow Down'],
        stageRight: ['Shift Arrow Right', 'Shift Arrow Right'],
        stageLeft: ['Shift Arrow Left', 'Shift Arrow Left']
    },
    numbers: {
        makeStructure: 'Numbers',
        toggleStructure: 'Numpad',
        enterChallenge: 'Shift Numbers'
    },
    toggles: [false, false, false, false, false, false, true],
    format: ['.', ''],
    theme: null,
    fontSize: 16,
    MDSettings: [false, false, false],
    SRSettings: [false, false],
    developerMode: false
};

export const saveGlobalSettings = (noSaving = false): string => {
    const hotkeysClone = deepClone(globalSave.hotkeys);
    const encoder = new TextEncoder();
    for (const key in hotkeysClone) {
        const array = hotkeysClone[key as hotkeysList];
        for (let i = 0; i < array.length; i++) {
            array[i] = String.fromCharCode(...encoder.encode(array[i]));
        }
    }
    const clone = { ...globalSave };
    clone.hotkeys = hotkeysClone;
    const save = btoa(JSON.stringify(clone));
    if (!noSaving) { localStorage.setItem(specialHTML.localStorage.settings, save); }
    return save;
};

export const toggleSpecial = (number: number, type: 'global' | 'mobile' | 'reader', change = false, reload = false) => {
    let toggles;
    if (type === 'mobile') {
        toggles = globalSave.MDSettings;
    } else if (type === 'reader') {
        toggles = globalSave.SRSettings;
    } else {
        toggles = globalSave.toggles;
    }

    if (change) {
        if (reload) {
            return void (async() => {
                if (!await Confirm('Changing this setting will reload the page, confirm?\n(Game will not autosave)')) { return; }
                pauseGame();
                toggles[number] = !toggles[number];
                saveGlobalSettings();
                window.location.reload();
                void Alert('Awaiting game reload');
            })();
        } else {
            toggles[number] = !toggles[number];
            saveGlobalSettings();
        }
    }

    let toggleHTML;
    if (type === 'mobile') {
        toggleHTML = getId(`MDToggle${number}`);
    } else if (type === 'reader') {
        toggleHTML = getId(`SRToggle${number}`);
    } else {
        toggleHTML = getId(`globalToggle${number}`);
    }

    if (!toggles[number]) {
        toggleHTML.style.color = 'var(--green-text)';
        toggleHTML.style.borderColor = 'forestgreen';
        toggleHTML.textContent = 'OFF';
    } else {
        toggleHTML.style.color = '';
        toggleHTML.style.borderColor = '';
        toggleHTML.textContent = 'ON';
    }
};

export const specialHTML = { //Images here are from true vacuum for easier cache
    /** [textContent] */
    resetHTML: ['', 'Discharge', 'Vaporization', 'Rank', 'Collapse', 'Merge', 'Nucleation'],
    longestBuilding: 7, //+1
    /** [src] */
    buildingHTML: [
        [],
        ['Preon.png', 'Quarks.png', 'Particle.png', 'Atom.png', 'Molecule.png'],
        ['Drop.png', 'Puddle.png', 'Pond.png', 'Lake.png', 'Sea.png', 'Ocean.png'],
        ['Cosmic%20dust.png', 'Planetesimal.png', 'Protoplanet.png', 'Natural%20satellite.png', 'Subsatellite.png'],
        ['Brown%20dwarf.png', 'Orange%20dwarf.png', 'Red%20supergiant.png', 'Blue%20hypergiant.png', 'Quasi%20star.png'],
        ['Nebula.png', 'Star%20cluster.png', 'Galaxy.png'],
        ['Dark%20planet.png']
    ],
    longestUpgrade: 14,
    /** [src] */
    upgradeHTML: [
        [], [
            'UpgradeQ1.png',
            'UpgradeQ2.png',
            'UpgradeQ3.png',
            'UpgradeQ4.png',
            'UpgradeQ5.png',
            'UpgradeQ6.png',
            'UpgradeQ7.png',
            'UpgradeQ8.png',
            'UpgradeQ9.png',
            'UpgradeQ10.png',
            'UpgradeQ11.png'
        ], [
            'UpgradeW1.png',
            'UpgradeW2.png',
            'UpgradeW3.png',
            'UpgradeW4.png',
            'UpgradeW5.png',
            'UpgradeW6.png',
            'UpgradeW7.png',
            'UpgradeW8.png',
            'UpgradeW9.png'
        ], [
            'UpgradeA1.png',
            'UpgradeA2.png',
            'UpgradeA3.png',
            'UpgradeA4.png',
            'UpgradeA5.png',
            'UpgradeA6.png',
            'UpgradeA7.png',
            'UpgradeA8.png',
            'UpgradeA9.png',
            'UpgradeA10.png',
            'UpgradeA11.png',
            'UpgradeA12.png',
            'UpgradeA13.png',
            'UpgradeA14.png'
        ], [
            'UpgradeS1.png',
            'UpgradeS2.png',
            'UpgradeS3.png',
            'UpgradeS4.png',
            'UpgradeS5.png',
            'Missing.png'
        ], [
            'UpgradeG1.png',
            'UpgradeG2.png',
            'UpgradeG3.png',
            'UpgradeG4.png',
            'UpgradeG5.png',
            'UpgradeG6.png',
            'Missing.png'
        ], [
            'Missing.png',
            'Missing.png'
        ]
    ],
    longestResearch: 9,
    /** [src, className] */
    researchHTML: [
        [], [
            ['ResearchQ1.png', 'stage1borderImage'],
            ['ResearchQ2.png', 'stage1borderImage'],
            ['ResearchQ3.png', 'stage1borderImage'],
            ['ResearchQ4.png', 'stage4borderImage'],
            ['ResearchQ5.png', 'stage4borderImage'],
            ['ResearchQ6.png', 'stage4borderImage']
        ], [
            ['ResearchW1.png', 'stage2borderImage'],
            ['ResearchW2.png', 'stage2borderImage'],
            ['ResearchW3.png', 'stage2borderImage'],
            ['ResearchW4.png', 'stage2borderImage'],
            ['ResearchW5.png', 'stage2borderImage'],
            ['ResearchW6.png', 'stage2borderImage'],
            ['Missing.png', 'stage2borderImage']
        ], [
            ['ResearchA1.png', 'stage3borderImage'],
            ['ResearchA2.png', 'stage2borderImage'],
            ['ResearchA3.png', 'stage3borderImage'],
            ['ResearchA4.png', 'stage3borderImage'],
            ['ResearchA5.png', 'stage3borderImage'],
            ['ResearchA6.png', 'stage3borderImage'],
            ['ResearchA7.png', 'stage1borderImage'],
            ['ResearchA8.png', 'redBorderImage'],
            ['ResearchA9.png', 'stage1borderImage']
        ], [
            ['ResearchS1.png', 'stage5borderImage'],
            ['ResearchS2.png', 'stage5borderImage'],
            ['ResearchS3.png', 'redBorderImage'],
            ['ResearchS4.png', 'stage5borderImage'],
            ['ResearchS5.png', 'stage6borderImage'],
            ['ResearchS6.png', 'stage4borderImage']
        ], [
            ['ResearchG1.png', 'stage1borderImage'],
            ['ResearchG2.png', 'stage6borderImage'],
            ['ResearchG3.png', 'stage6borderImage'],
            ['ResearchG4.png', 'stage4borderImage'],
            ['Missing.png', 'redBorderImage']
        ], [
            ['ResearchD1.png', 'stage3borderImage'],
            ['ResearchD2.png', 'stage3borderImage'],
            ['ResearchD3.png', 'stage2borderImage'],
            ['ResearchD4.png', 'stage3borderImage'],
            ['ResearchD5.png', 'stage3borderImage']
        ]
    ],
    longestResearchExtra: 6,
    /** [src, className, hoverText] */
    researchExtraDivHTML: [
        [],
        ['Energy%20Researches.png', 'stage4borderImage', 'Energy'],
        ['Cloud%20Researches.png', 'stage2borderImage', 'Clouds'],
        ['Rank%20Researches.png', 'stage6borderImage', 'Rank'],
        ['Collapse%20Researches.png', 'stage6borderImage', 'Collapse'],
        ['Galaxy%20Researches.png', 'stage3borderImage', 'Galaxy'],
        ['Missing.png', 'stage3borderImage', 'Dark']
    ],
    /** [src, className] */
    researchExtraHTML: [
        [], [
            ['ResearchEnergy1.png', 'stage1borderImage'],
            ['ResearchEnergy2.png', 'stage5borderImage'],
            ['ResearchEnergy3.png', 'stage3borderImage'],
            ['ResearchEnergy4.png', 'stage1borderImage'],
            ['ResearchEnergy5.png', 'stage6borderImage'],
            ['ResearchEnergy6.png', 'stage1borderImage']
        ], [
            ['ResearchClouds1.png', 'stage3borderImage'],
            ['ResearchClouds2.png', 'stage2borderImage'],
            ['ResearchClouds3.png', 'stage4borderImage'],
            ['ResearchClouds4.png', 'stage2borderImage'],
            ['ResearchClouds5.png', 'stage2borderImage']
        ], [
            ['ResearchRank1.png', 'stage3borderImage'],
            ['ResearchRank2.png', 'stage3borderImage'],
            ['ResearchRank3.png', 'stage3borderImage'],
            ['ResearchRank4.png', 'stage2borderImage'],
            ['ResearchRank5.png', 'stage2borderImage'],
            ['ResearchRank6.png', 'stage6borderImage']
        ], [
            ['ResearchCollapse1.png', 'stage6borderImage'],
            ['ResearchCollapse2.png', 'redBorderImage'],
            ['ResearchCollapse3.png', 'stage1borderImage'],
            ['ResearchCollapse4.png', 'stage6borderImage'],
            ['Missing.png', 'redBorderImage']
        ], [
            ['ResearchGalaxy1.png', 'stage3borderImage'],
            ['ResearchGalaxy2.png', 'brownBorderImage'],
            ['ResearchGalaxy3.png', 'stage3borderImage'],
            ['ResearchGalaxy4.png', 'brownBorderImage'],
            ['Missing.png', 'redBorderImage'],
            ['Missing.png', 'redBorderImage']
        ], [
            ['ResearchDark1.png', 'stage6borderImage'],
            ['ResearchDark2.png', 'stage3borderImage'],
            ['Missing.png', 'redBorderImage'],
            ['Missing.png', 'redBorderImage']
        ]
    ],
    longestFooterStats: 3,
    /** [src, className, textcontent] */
    footerStatsHTML: [
        [], [
            ['Energy%20mass.png', 'stage1borderImage cyanText', 'Mass'],
            ['Energy.png', 'stage4borderImage orangeText', 'Energy']
        ], [
            ['Water.png', 'stage2borderImage blueText', 'Moles'],
            ['Drop.png', 'stage2borderImage blueText', 'Drops'],
            ['Clouds.png', 'stage3borderImage grayText', 'Clouds']
        ], [
            ['Mass.png', 'stage3borderImage grayText', 'Mass']
        ], [
            ['Elements.png', 'stage4borderImage orangeText', 'Stardust'],
            ['Main_sequence%20mass.png', 'stage1borderImage cyanText', 'Mass']
        ], [
            ['Elements.png', 'stage4borderImage orangeText', 'Stardust'],
            ['Main_sequence%20mass.png', 'stage1borderImage cyanText', 'Mass'],
            ['Stars.png', 'redBorderImage redText', 'Stars']
        ], [
            ['Dark%20matter.png', 'stage3borderImage grayText', 'Matter'],
            ['Dark%20energy.png', 'stage3borderImage grayText', 'Energy'],
            ['Dark%20fluid.png', 'stage6borderImage darkvioletText', 'Fluid']
        ]
    ],
    mobileDevice: { //All browsers that I tested didn't properly detected more than 1 touch
        /** [X, Y] */
        start: [0, 0]
    },
    localStorage: {
        /** Index for game's primary save slot */
        main: 'save',
        /** Index for global game settings */
        settings: 'fundamentalSettings'
    },
    cache: {
        imagesDiv: document.createElement('div'), //Saved just in case
        /** Lazy way to optimize HTML, without it can't properly detect changes */
        innerHTML: new Map<string | HTMLElement, any>(),
        idMap: new Map<string, HTMLElement>(),
        classMap: new Map<string, HTMLCollectionOf<HTMLElement>>(),
        queryMap: new Map<string, HTMLElement>()
    },
    errorCooldowns: [] as string[],
    /** [text, true ? incrementFunc : closeFunc] */
    notifications: [] as Array<[string, (instantClose?: boolean) => void]>,
    /** [priority, closeFunc] */
    alert: [null, null] as [number | null, (() => void) | null],
    bigWindow: null as 'version' | 'hotkeys' | 'log' | null,
    styleSheet: document.createElement('style') //Secondary
};

export const preventImageUnload = () => {
    if (global.offline.active || global.paused) {
        global.offline.cacheUpdate = true;
        return;
    }
    const { footerStatsHTML: footer, buildingHTML: build, upgradeHTML: upgrade, researchHTML: research, researchExtraHTML: extra, researchExtraDivHTML: extraDiv } = specialHTML;

    let images = '';
    for (let s = 1; s <= 6; s++) {
        for (let i = 0; i < footer[s].length; i++) {
            if (s === 2) {
                if (i === 1) { continue; } //Drops
            } else if (s === 5 && i < 2) { continue; } //Solar mass and Stardust
            images += `<img src="Used_art/${footer[s][i][0]}" loading="lazy">`;
        }
        for (let i = 0; i < build[s].length; i++) {
            images += `<img src="Used_art/${build[s][i]}" loading="lazy">`;
        }
        for (let i = 0; i < upgrade[s].length; i++) {
            images += `<img src="Used_art/${upgrade[s][i]}" loading="lazy">`;
        }
        for (let i = 0; i < research[s].length; i++) {
            images += `<img src="Used_art/${research[s][i][0]}" loading="lazy">`;
        }
        for (let i = 0; i < extra[s].length; i++) {
            images += `<img src="Used_art/${extra[s][i][0]}" loading="lazy">`;
        }
        images += `<img src="Used_art/${extraDiv[s][0]}" loading="lazy">`;
        images += `<img src="Used_art/Stage${s}%20border.png" loading="lazy">`;
    }
    for (const text of global.accretionInfo.rankImage) { //Already cached in Accretion stats, this only refreshes it
        images += `<img src="Used_art/${text}" loading="lazy">`;
    }
    for (const text of ['Red%20giant', 'White%20dwarf', 'Neutron%20star', 'Quark%20star', 'Galaxy%20group']) { //Galaxy%20cluster
        images += `<img src="Used_art/${text}.png" loading="lazy">`;
    }
    specialHTML.cache.imagesDiv.innerHTML = images;

    setTimeout(preventImageUnload, 3600_000);
};

/** Not providing value for 'theme' will make it use one from globalSave and remove all checks */
export const setTheme = (theme = 'current' as 'current' | number | null) => {
    if (theme !== 'current') {
        if (theme !== null) {
            if (player.stage.true < theme) { theme = null; }
            if (theme === 6 && player.stage.true < 7) { theme = null; }
        }
        getId(`switchTheme${globalSave.theme ?? 0}`).style.textDecoration = '';

        globalSave.theme = theme;
        saveGlobalSettings();
        getId('currentTheme').textContent = theme === null ? 'Default' : global.stageInfo.word[theme];
        getId(`switchTheme${theme ?? 0}`).style.textDecoration = 'underline';
    } else { theme = globalSave.theme; }

    const upgradeTypes = ['upgrade', 'element'];
    const properties = {
        '--background-color': '#030012',
        '--window-color': '#12121c',
        '--window-border': 'cornflowerblue',
        '--footer-color': 'darkblue',
        '--button-color': 'mediumblue',
        '--button-border': 'darkcyan',
        '--button-hover': '#2626ff',
        '--building-afford': '#a90000',
        '--tab-active': '#8b00c5',
        '--tab-elements': '#9f6700',
        '--tab-strangeness': '#00b100',
        '--tab-inflation': '#6c1ad1',
        '--hollow-hover': '#170089',
        '--footerButton-hover': '#181818',
        '--input-border': '#831aa5',
        '--input-text': '#cf71ff',
        '--button-text': '#e3e3e3',
        '--main-text': 'var(--cyan-text)',
        '--white-text': 'white',
        //'--cyan-text': '#03d3d3',
        '--blue-text': 'dodgerblue',
        '--orange-text': 'darkorange',
        '--gray-text': '#8f8f8f',
        '--orchid-text': '#e14bdb',
        '--darkorchid-text': '#bd24ef',
        '--darkviolet-text': '#8b3cec',
        //'--brown-text': '#9b7346',
        '--red-text': '#eb0000',
        '--green-text': '#00e900',
        '--yellow-text': '#fafa00'
    };

    /* Many of these colors will need to be changed in other places (find them with quick search, there are too many of them) */
    switch (theme ?? player.stage.active) {
        case 1:
            for (const text of upgradeTypes) {
                getId(`${text}Text`).style.color = 'var(--darkorchid-text)';
                getId(`${text}Effect`).style.color = 'var(--blue-text)';
                getId(`${text}Cost`).style.color = 'var(--orange-text)';
            }
            properties['--tab-inflation'] = 'var(--tab-active)';
            break;
        case 2:
            for (const text of upgradeTypes) {
                getId(`${text}Text`).style.color = 'var(--white-text)';
                getId(`${text}Effect`).style.color = 'var(--green-text)';
                getId(`${text}Cost`).style.color = 'var(--cyan-text)';
            }
            properties['--background-color'] = '#070026';
            properties['--window-color'] = '#000052';
            properties['--window-border'] = 'blue';
            properties['--footer-color'] = '#0000db';
            properties['--button-color'] = '#0000eb';
            properties['--button-border'] = '#386cc7';
            properties['--button-hover'] = '#2929ff';
            properties['--building-afford'] = '#b30000';
            properties['--tab-active'] = '#990000';
            properties['--hollow-hover'] = '#2400d7';
            properties['--input-border'] = '#4747ff';
            properties['--input-text'] = 'dodgerblue';
            properties['--main-text'] = 'var(--blue-text)';
            properties['--gray-text'] = '#9b9b9b';
            properties['--darkorchid-text'] = '#c71bff';
            properties['--darkviolet-text'] = '#8766ff';
            properties['--green-text'] = '#82cb3b';
            properties['--red-text'] = '#f70000';
            break;
        case 3:
            for (const text of upgradeTypes) {
                getId(`${text}Text`).style.color = 'var(--orange-text)';
                getId(`${text}Effect`).style.color = 'var(--blue-text)';
                getId(`${text}Cost`).style.color = 'var(--green-text)';
            }
            properties['--background-color'] = '#000804';
            properties['--window-color'] = '#2e1200';
            properties['--window-border'] = '#31373e';
            properties['--footer-color'] = '#221a00';
            properties['--button-color'] = '#291344';
            properties['--button-border'] = '#424242';
            properties['--button-hover'] = '#382055';
            properties['--building-afford'] = '#9e0000';
            properties['--tab-active'] = '#8d4c00';
            properties['--tab-elements'] = 'var(--tab-active)';
            properties['--hollow-hover'] = '#5a2100';
            properties['--footerButton-hover'] = '#1a1a1a';
            properties['--input-border'] = '#8b4a00';
            properties['--input-text'] = '#e77e00';
            properties['--main-text'] = 'var(--gray-text)';
            properties['--white-text'] = '#dfdfdf';
            properties['--orange-text'] = '#f58600';
            properties['--green-text'] = '#00db00';
            break;
        case 4:
            for (const text of upgradeTypes) {
                getId(`${text}Text`).style.color = 'var(--blue-text)';
                getId(`${text}Effect`).style.color = 'var(--green-text)';
                getId(`${text}Cost`).style.color = 'var(--cyan-text)';
            }
            properties['--background-color'] = '#140e04';
            properties['--window-color'] = '#4e0000';
            properties['--window-border'] = '#894800';
            properties['--footer-color'] = '#4e0505';
            properties['--button-color'] = '#6a3700';
            properties['--button-border'] = '#a35700';
            properties['--button-hover'] = '#8a4700';
            properties['--building-afford'] = '#007f95';
            properties['--tab-active'] = '#008297';
            properties['--tab-elements'] = 'var(--tab-active)';
            properties['--tab-strangeness'] = '#00a500';
            properties['--hollow-hover'] = '#605100';
            properties['--footerButton-hover'] = '#212121';
            properties['--input-border'] = '#008399';
            properties['--input-text'] = '#05c3c3';
            properties['--button-text'] = '#d9d900';
            properties['--main-text'] = 'var(--orange-text)';
            properties['--white-text'] = '#e5e500';
            properties['--blue-text'] = '#2e96ff';
            properties['--gray-text'] = '#8b8b8b';
            properties['--darkorchid-text'] = '#c71bff';
            properties['--darkviolet-text'] = '#9457ff';
            properties['--red-text'] = 'red';
            properties['--green-text'] = '#00e600';
            properties['--yellow-text'] = 'var(--green-text)';
            break;
        case 5:
            for (const text of upgradeTypes) {
                getId(`${text}Text`).style.color = 'var(--orange-text)';
                getId(`${text}Effect`).style.color = 'var(--green-text)';
                getId(`${text}Cost`).style.color = 'var(--red-text)';
            }
            properties['--background-color'] = '#060010';
            properties['--window-color'] = '#001d42';
            properties['--window-border'] = '#35466e';
            properties['--footer-color'] = '#2f005c';
            properties['--button-color'] = '#4a008f';
            properties['--button-border'] = '#8f004c';
            properties['--button-hover'] = '#6800d6';
            properties['--building-afford'] = '#8603ff';
            properties['--tab-active'] = '#8500ff';
            properties['--tab-inflation'] = 'var(--tab-active)';
            properties['--hollow-hover'] = '#3b0080';
            properties['--footerButton-hover'] = '#1a1a1a';
            properties['--input-border'] = '#3656a1';
            properties['--input-text'] = '#6a88cd';
            properties['--button-text'] = '#fc9cfc';
            properties['--main-text'] = 'var(--darkorchid-text)';
            properties['--white-text'] = '#ff79ff';
            properties['--orchid-text'] = '#ff00f4';
            properties['--darkorchid-text'] = '#c000ff';
            properties['--darkviolet-text'] = '#8861ff';
            properties['--yellow-text'] = 'var(--darkviolet-text)';
            break;
        case 6:
            for (const text of upgradeTypes) {
                getId(`${text}Text`).style.color = 'var(--orchid-text)';
                getId(`${text}Effect`).style.color = 'var(--orange-text)';
                getId(`${text}Cost`).style.color = 'var(--red-text)';
            }
            properties['--background-color'] = 'black';
            properties['--window-color'] = '#01003c';
            properties['--window-border'] = '#6500e0';
            properties['--footer-color'] = '#00007a';
            properties['--button-color'] = '#2b0095';
            properties['--button-border'] = '#6c1ad1';
            properties['--button-hover'] = '#3d00d6';
            properties['--building-afford'] = '#b30000';
            properties['--tab-active'] = '#8d0000';
            properties['--tab-inflation'] = 'var(--tab-active)';
            properties['--hollow-hover'] = '#490070';
            properties['--input-border'] = '#a50000';
            properties['--input-text'] = 'red';
            properties['--button-text'] = '#bfbdff';
            properties['--main-text'] = 'var(--darkviolet-text)';
            properties['--white-text'] = '#aba8ff';
            properties['--gray-text'] = '#9b9b9b';
            properties['--darkviolet-text'] = '#8157ff';
            properties['--red-text'] = 'red';
            properties['--yellow-text'] = 'var(--green-text)';
    }

    const bodyStyle = document.documentElement.style;
    bodyStyle.setProperty('--transition-all', '500ms');
    bodyStyle.setProperty('--transition-buttons', '500ms');
    for (const property in properties) { bodyStyle.setProperty(property, properties[property as '--main-text']); }

    setTimeout(() => {
        bodyStyle.setProperty('--transition-all', '0ms');
        bodyStyle.setProperty('--transition-buttons', '100ms');
    }, 500);
};

export const Alert = async(text: string, priority = 0): Promise<void> => {
    return await new Promise((resolve) => {
        if (specialHTML.alert[0] !== null) {
            if (specialHTML.alert[0] < priority) {
                (specialHTML.alert[1] as () => undefined)();
                Notify(`Alert has been replaced with higher priority one\nOld text: ${getId('alertText').textContent}`);
            } else {
                resolve();
                Notify(`Another Alert is already active\nMissed text: ${text}`);
                return;
            }
        }

        getId('alertText').textContent = text;
        const body = document.documentElement;
        const blocker = getId('alertMain');
        const confirm = getId('alertConfirm');
        blocker.style.display = '';
        body.classList.remove('noTextSelection');
        const oldFocus = document.activeElement as HTMLElement | null;
        confirm.focus();

        const key = async(event: KeyboardEvent) => {
            const shift = detectShift(event);
            if (shift === null) { return; }
            const code = event.code;
            if (code === 'Escape' || code === 'Enter' || code === 'Space') {
                if (shift) { return; }
                close();
            } else if (code === 'Tab') {
                confirm.focus();
            } else { return; }
            event.preventDefault();
        };
        const close = () => {
            if (!globalSave.toggles[2]) { body.classList.add('noTextSelection'); }
            blocker.style.display = 'none';
            body.removeEventListener('keydown', key);
            confirm.removeEventListener('click', close);
            specialHTML.alert = [null, null];
            oldFocus?.focus();
            resolve();
        };
        specialHTML.alert = [priority, close];
        body.addEventListener('keydown', key);
        confirm.addEventListener('click', close);
    });
};

export const Confirm = async(text: string, priority = 0): Promise<boolean> => {
    return await new Promise((resolve) => {
        if (specialHTML.alert[0] !== null) {
            if (specialHTML.alert[0] < priority) {
                (specialHTML.alert[1] as () => undefined)();
                Notify(`Alert has been replaced with higher priority one\nOld text: ${getId('alertText').textContent}`);
            } else {
                resolve(false);
                Notify(`Another Alert is already active\nMissed text: ${text}`);
                return;
            }
        }

        getId('alertText').textContent = text;
        const body = document.documentElement;
        const blocker = getId('alertMain');
        const cancel = getId('alertCancel');
        const confirm = getId('alertConfirm');
        blocker.style.display = '';
        cancel.style.display = '';
        body.classList.remove('noTextSelection');
        const oldFocus = document.activeElement as HTMLElement | null;
        confirm.focus();

        let result = false;
        const yes = () => {
            result = true;
            close();
        };
        const key = (event: KeyboardEvent) => {
            const shift = detectShift(event);
            if (shift === null) { return; }
            const code = event.code;
            if (code === 'Escape') {
                if (shift) { return; }
                close();
            } else if (code === 'Enter' || code === 'Space') {
                if (shift || document.activeElement === cancel) { return; }
                yes();
            } else if (code === 'Tab') {
                (document.activeElement === cancel ? confirm : cancel).focus();
            } else { return; }
            event.preventDefault();
        };
        const close = () => {
            if (!globalSave.toggles[2]) { body.classList.add('noTextSelection'); }
            blocker.style.display = 'none';
            cancel.style.display = 'none';
            body.removeEventListener('keydown', key);
            confirm.removeEventListener('click', yes);
            cancel.removeEventListener('click', close);
            specialHTML.alert = [null, null];
            oldFocus?.focus();
            resolve(result);
        };
        specialHTML.alert = [priority, close];
        body.addEventListener('keydown', key);
        confirm.addEventListener('click', yes);
        cancel.addEventListener('click', close);
    });
};

export const Prompt = async(text: string, placeholder = '', priority = 0): Promise<string | null> => {
    return await new Promise((resolve) => {
        if (specialHTML.alert[0] !== null) {
            if (specialHTML.alert[0] < priority) {
                (specialHTML.alert[1] as () => undefined)();
                Notify(`Alert has been replaced with higher priority one\nOld text: ${getId('alertText').textContent}`);
            } else {
                resolve(null);
                Notify(`Another Alert is already active\nMissed text: ${text}`);
                return;
            }
        }

        getId('alertText').textContent = text;
        const body = document.documentElement;
        const blocker = getId('alertMain');
        const input = getId('alertInput') as HTMLInputElement;
        const cancel = getId('alertCancel');
        const confirm = getId('alertConfirm');
        blocker.style.display = '';
        cancel.style.display = '';
        input.style.display = '';
        body.classList.remove('noTextSelection');
        input.placeholder = placeholder;
        input.value = '';
        const oldFocus = document.activeElement as HTMLElement | null;
        input.focus();

        let result: null | string = null;
        const yes = () => {
            result = input.value === '' ? input.placeholder : input.value;
            close();
        };
        const key = (event: KeyboardEvent) => {
            const shift = detectShift(event);
            if (shift === null) { return; }
            const code = event.code;
            if (code === 'Escape') {
                if (shift) { return; }
                close();
            } else if (code === 'Enter' || code === 'Space') {
                const active = document.activeElement;
                if (shift || (code === 'Space' && active === input) || active === cancel) { return; }
                yes();
            } else if (code === 'Tab') {
                if (shift && document.activeElement === input) {
                    cancel.focus();
                } else if (!shift && document.activeElement === cancel) {
                    input.focus();
                } else { return; }
            } else { return; }
            event.preventDefault();
        };
        const close = () => {
            if (!globalSave.toggles[2]) { body.classList.add('noTextSelection'); }
            blocker.style.display = 'none';
            cancel.style.display = 'none';
            input.style.display = 'none';
            body.removeEventListener('keydown', key);
            confirm.removeEventListener('click', yes);
            cancel.removeEventListener('click', close);
            specialHTML.alert = [null, null];
            oldFocus?.focus();
            resolve(result);
        };
        specialHTML.alert = [priority, close];
        body.addEventListener('keydown', key);
        confirm.addEventListener('click', yes);
        cancel.addEventListener('click', close);
    });
};

/** Start will make it behave as if X duplicates have been detected */
export const Notify = (text: string) => {
    const { notifications } = specialHTML;

    let index;
    for (let i = 0; i < notifications.length; i++) {
        if (notifications[i][0] === text) {
            index = i;
            break;
        }
    }

    if (index === undefined) {
        let count = 1;
        let timeout: number;

        const html = document.createElement('p');
        html.textContent = `${text}${count > 1 ? ` | x${count}` : ''}`;
        html.style.animation = 'hideX 800ms ease-in-out reverse';
        html.style.pointerEvents = 'none';
        if (globalSave.SRSettings[0]) { html.role = 'alert'; }
        getId('notifications').append(html);

        const pointer = notifications[notifications.push([text, (instantClose = false) => {
            if (instantClose) {
                if (html.style.animation === '') { remove(); }
                return;
            }
            html.textContent = `${text} | x${++count}`;
            if (timeout === undefined) { return; }
            clearTimeout(timeout);
            timeout = setTimeout(remove, 7200);
        }]) - 1];
        const remove = () => {
            const index = notifications.indexOf(pointer);
            if (index !== -1) { notifications.splice(index, 1); }
            html.removeEventListener('click', remove);
            html.style.animation = 'hideX 800ms ease-in-out forwards';
            html.style.pointerEvents = 'none';
            setTimeout(() => html.remove(), 800);
            clearTimeout(timeout);
        };
        setTimeout(() => {
            html.style.animation = '';
            html.style.pointerEvents = '';
            timeout = setTimeout(remove, 7200);
            html.addEventListener('click', remove);
        }, 800);
    } else { notifications[index][1](); }
};

/** Notify about error in the code with a cooldown of 20 seconds */
export const errorNotify = (text: string) => {
    const { errorCooldowns } = specialHTML;
    if (errorCooldowns.includes(text)) { return; }

    Notify(text);
    errorCooldowns.push(text);
    setTimeout(() => {
        const index = errorCooldowns.indexOf(text);
        if (index !== -1) { errorCooldowns.splice(index, 1); }
    }, 2e4);
};

export const resetMinSizes = (full = true) => {
    for (let i = 1; i <= 3; i++) {
        const element = getQuery(`#special${i} > p`);
        specialHTML.cache.innerHTML.set(element, '');
        element.style.minWidth = '';
    }
    for (let i = 0; i < global.researchesInfo[player.stage.active].maxActive; i++) {
        const element = getQuery(`#research${i + 1} span`);
        specialHTML.cache.innerHTML.set(element, '');
        element.style.minWidth = '';
    }
    for (let i = 0; i < global.researchesExtraInfo[player.stage.active].maxActive; i++) {
        const element = getQuery(`#researchExtra${i + 1} span`);
        specialHTML.cache.innerHTML.set(element, '');
        element.style.minWidth = '';
    }

    if (!full) { return; }
    const mile = getId('milestonesMultiline').parentElement as HTMLElement;
    specialHTML.cache.innerHTML.set(mile, '');
    mile.style.minHeight = '';
};

export const changeFontSize = (initial = false) => {
    const input = getId('customFontSize') as HTMLInputElement;
    const size = Math.min(Math.max(initial ? globalSave.fontSize : (input.value === '' ? 16 : Math.floor(Number(input.value) * 100) / 100), 12), 24);
    if (!initial) {
        globalSave.fontSize = size;
        saveGlobalSettings();
        resetMinSizes();
    }

    document.documentElement.style.fontSize = size === 16 ? '' : `${size}px`;
    input.value = `${size}`;
    (getId('phoneStyle') as HTMLLinkElement).media = `screen and (max-width: ${893 * size / 16 + 32}px)`;
    (getId('miniPhoneStyle') as HTMLLinkElement).media = `screen and (max-width: ${362 * size / 16 + 32}px)`;
};

export const changeFormat = (point: boolean) => {
    const htmlInput = (point ? getId('decimalPoint') : getId('thousandSeparator')) as HTMLInputElement;
    let value = htmlInput.value.replace(' ', ' '); //No break space
    const allowed = ['.', '·', ',', ' ', '_', "'", '"', '`', '|'].includes(value);
    if (!allowed || globalSave.format[point ? 1 : 0] === value) {
        if (point && globalSave.format[1] === '.') {
            (getId('thousandSeparator') as HTMLInputElement).value = '';
            globalSave.format[1] = '';
        }
        value = point ? '.' : '';
        htmlInput.value = value;
    }
    globalSave.format[point ? 0 : 1] = value;
    saveGlobalSettings();
};

export const MDStrangenessPage = (stageIndex: number) => {
    getId(`strangenessSection${global.debug.MDStrangePage}`).style.display = 'none';
    getId(`strangenessSection${stageIndex}`).style.display = '';
    global.debug.MDStrangePage = stageIndex;
};

export const replayEvent = async() => {
    const last = player.stage.true >= 8 ? (player.event ? 12 : 11) :
        player.stage.true === 7 ? (player.event ? 10 : 9) :
        player.stage.true === 6 ? (player.event ? 8 : player.stage.resets >= 1 ? 7 : 6) :
        player.stage.true - (player.event ? 0 : 1);
    if (last < 1) { return void Alert('There are no unlocked events'); }

    let text = 'Which event do you want to see again?\nEvent 1: Stage reset';
    if (last >= 2) { text += '\nEvent 2: Clouds softcap'; }
    if (last >= 3) { text += '\nEvent 3: New Rank'; }
    if (last >= 4) { text += '\nEvent 4: New Elements'; }
    if (last >= 5) { text += '\nEvent 5: Intergalactic'; }
    if (last >= 6) { text += '\nEvent 6: True Vacuum'; }
    if (last >= 7) { text += '\nEvent 7: Void unlocked'; }
    if (last >= 8) { text += '\nEvent 8: First Merge'; }
    if (last >= 9) { text += '\nEvent 9: Inflation'; }
    if (last >= 10) { text += '\nEvent 10: Supervoid'; }
    if (last >= 11) { text += '\nEvent 11: Big rip'; }
    if (last >= 12) { text += '\nEvent 12: Void Universes'; }

    const event = Number(await Prompt(text, `${last}`));
    if (event <= 0 || !isFinite(event)) { return; }
    if (event > last) { return void Alert('That event is not unlocked'); }
    playEvent(event);
};

/** Sets player.event to true if replay is false */
export const playEvent = (event: number, replay = true) => {
    if (global.offline.active || specialHTML.alert[0] !== null) { return; }
    if (!replay) { player.event = true; }

    let text = 'No such event';
    if (event === 1) {
        text = 'A new reset tier has been unlocked. It will allow the creation of higher tier Structures, but for the price of everything else';
    } else if (event === 2) {
        text = `Cloud density is too high... Any new Clouds past ${format(1e4)} will be weaker due to the softcap`;
    } else if (event === 3) {
        if (!replay) {
            assignResetInformation.rankInformation();
            global.debug.rankUpdated = null;
        }
        text = 'Cannot gain any more Mass with the current Rank. A new one has been unlocked, but reaching it will softcap the Mass production';
    } else if (event === 4) {
        text = 'That last explosion not only created the first Neutron stars, but also unlocked new Elements through Supernova nucleosynthesis';
    } else if (event === 5) {
        if (!replay) { stageUpdate(false); }
        text = "There are no Structures in Intergalactic yet, but knowledge for their creation can be found within the previous Stages. Stage resets and exports will now award Strange quarks, '[26] Iron' Element will use new effect to improve Stage reset reward.\n(Stars in Intergalactic are just Stars from Interstellar)";
    } else if (event === 6) {
        text = 'As Galaxies began to Merge, their combined Gravity pushed Vacuum out of its local minimum into a more stable global minimum. New forces and Structures are expected within this new and true Vacuum state';
    } else if (event === 7) {
        text = "With Vacuum decaying, the remaining matter had rearranged itself, which had lead to the formation of the 'Void'. Check it out in the 'Advanced' subtab";
    } else if (event === 8) {
        if (!replay) { stageUpdate(false); }
        text = "As Galaxies began to Merge, their combined Gravity started forming an even bigger Structure - the 'Universe'. Will need to maximize Galaxies before every Merge to get enough Score to create it.\n(Merge reset can only be done a limited amount of times per Stage reset)";
    } else if (event === 9) {
        text = "Now that the first Universe is finished, it's time to Inflate a new one and so to unlock the Inflation tab, new Upgrades and more Void rewards to complete\n(Also improve 'Nucleosynthesis' effect to unlock more Elements for every self-made Universe and exports will now fully claim their storage)";
    } else if (event === 10) {
        if (!replay) {
            visualTrueStageUnlocks();
            switchTab();
        }
        text = "Now that there was even more matter to rearrange ‒ the 'Supervoid' was formed. Check it out by clicking on the Void name in the 'Advanced' subtab.\n(Also unlocked 2 new Inflations, Supervoid unlocks are kept through Universe reset)";
    } else if (event === 11) {
        text = "You had triggered the scenario known as 'Big Crunch' by modifying ratio of Dark energy to make it way more attractive, which converted everything up to this point into Cosmons.\n(Unlocked new Inflation Milestones, new Challenge and time required for a max Export reward is now reduced by 4)";
    } else if (event === 12) {
        text = 'Void Universes are weaker version of self-made Universes. They unlock and award mostly the same stuff, but do not count as self-made. They can be created only under the Void time limit.';
    }
    if (!replay) { text += "\n\n(Can be viewed again with 'Events' button in Settings tab)"; }
    return void Alert(text);
};

const buildBigWindow = (subWindow: string): null | HTMLElement => {
    if (getId('closeBigWindow', true) === null) {
        getId('bigWindow').innerHTML = '<div role="dialog" aria-modal="false"><button type="button" id="closeBigWindow">Close</button></div>';
        specialHTML.styleSheet.textContent += `#bigWindow > div { display: flex; flex-direction: column; align-items: center; width: 38rem; max-width: 80vw; height: 42rem; max-height: 90vh; background-color: var(--window-color); border: 3px solid var(--window-border); border-radius: 12px; padding: 1em 1em 0.8em; row-gap: 1em; }
            #bigWindow > div > button { flex-shrink: 0; border-radius: 4px; width: 6em; font-size: 0.92em; }
            #bigWindow > div > div { width: 100%; height: 100%; overflow-y: auto; overscroll-behavior-y: none; } `;
    }

    if (getId(subWindow, true) !== null) { return null; }
    const mainHTML = document.createElement('div');
    getQuery('#bigWindow > div').prepend(mainHTML);
    mainHTML.id = subWindow;
    mainHTML.role = 'dialog';
    return mainHTML;
};
const addCloseEvents = (sectionHTML: HTMLElement, firstTargetHTML = null as HTMLElement | null) => {
    const body = document.documentElement;
    const closeButton = getId('closeBigWindow');
    const windowHMTL = getId('bigWindow');
    if (firstTargetHTML === null) { firstTargetHTML = closeButton; }
    const key = (event: KeyboardEvent) => {
        if (specialHTML.alert[0] !== null || detectShift(event) !== false) { return; }
        const code = event.code;
        if (firstTargetHTML === closeButton ? (code === 'Escape' || code === 'Enter' || code === 'Space') :
            ((!global.hotkeys.disabled && code === 'Escape') || ((code === 'Enter' || code === 'Space') && document.activeElement === closeButton))) {
            event.preventDefault();
            close();
        }
    };
    const close = () => {
        specialHTML.bigWindow = null;
        windowHMTL.style.display = 'none';
        sectionHTML.style.display = 'none';
        body.removeEventListener('keydown', key);
        closeButton.removeEventListener('click', close);
    };
    body.addEventListener('keydown', key);
    closeButton.addEventListener('click', close);
    sectionHTML.style.display = '';
    windowHMTL.style.display = '';
    firstTargetHTML.focus();
};

export const openVersionInfo = () => {
    if (specialHTML.bigWindow !== null) { return; }
    const mainHTML = buildBigWindow('versionHTML');
    if (mainHTML !== null) {
        mainHTML.innerHTML = `${global.lastUpdate !== null ? `<h5><span class="bigWord">Last update:</span> <span class="whiteText">${new Date(global.lastUpdate).toLocaleString()}</span></h5><br>` : ''}
        <h6>v0.2.7</h6><p>- Small speed up to Universes\n- Stage resets now save peak Strange quarks</p>
        <h6>v0.2.6</h6><p>- New content (Big Rip)\n- Mobile shorcuts are now available outside of related support\n- Ability to change number hotkeys and use numbers for other hotkeys\n- Create all Upgrades button\n- Improved hover text\n\n- Added hotkeys for toggling autos\n<a href="https://docs.google.com/document/d/1IvO79XV49t_3zm6s4YE-ItU-TahYDbZIWhVAPzqjBUM/edit?usp=sharing" target="_blank" rel="noopener noreferrer">Full changelog</a></p>
        <h6>v0.2.5</h6><p>- Abyss rework\n- New (second) Challenge\n- Global footer stats\n- Small visual improvements\n- Improved swiping hotkeys for Phones</p>
        <h6>v0.2.4</h6><p>- Offline ticks are now as effective as Online\n- Inflation loadouts\n\n- Added the log\n- Minor Strangeness rebalance</p>
        <h6>v0.2.3</h6><p>- Supervoid rework\n- Abyss small rebalance</p>
        <h6>v0.2.2</h6><p>- New content (Supervoid)\n- Entering Void now saves the game to load it after exiting</p>
        <h6>v0.2.1</h6><p>- New content (Abyss)\n- Full game rebalance\n- Custom hotkeys\n- Updated supports\n- Many small changes and additions</p>
        <h6>v0.2.0</h6><p>- Reworked balance for all Stages past first reset cycle\n- Many quality of life additions\n- Most of settings are now saved separate from save file\n- Some more work on Mobile device support</p>
        <h6>v0.1.9</h6><p>- More true Vacuum balance\n- Reworked time related formats\n- Offline time reworked</p>
        <h6>v0.1.8</h6><p>- True Vacuum small balance changes\n- Upgrades and Researches merged\n- Copy to the clipboard, load from string save file options</p>
        <h6>v0.1.7</h6><p>- New content (Void)\n- Further balance changes</p>
        <h6>v0.1.6</h6><p>- Massive rebalance and reworks for all Stages</p>
        <h6>v0.1.5</h6><p>- True Vacuum minor balance\n- Images no longer unload\n- Screen reader support reworked</p>
        <h6>v0.1.4</h6><p>- Custom scrolls\n- Notifications</p>
        <h6>v0.1.3</h6><p>- True Vacuum balance changes\n- Submerged Stage minor balance\n- Replay event button\n\n- History for Stage resets</p>
        <h6>v0.1.2</h6><p>- New content (Vacuum)\n- Version window\n- Permanently removed text movement</p>
        <h6>v0.1.1</h6><p>- More balance changes for late game</p>
        <h6>v0.1.0</h6><p>- New content (Intergalactic)\n- Balance changes for late game</p>
        <h6>v0.0.9</h6><p>- New content (Milestones)\n- More Interstellar and late game balance</p>
        <h6>v0.0.8</h6><p>- Minor speed up to all Stages past Microworld</p>
        <h6>v0.0.7</h6><p>- New content (Strangeness)\n- Microworld Stage rework\n\n- Stats for the Save file name</p>
        <h6>v0.0.6</h6><p>- Added hotkeys list\n\n- Option to remove text movement\n- Ability to rename the save file</p>
        <h6>v0.0.5</h6><p>- New content (Interstellar)\n- Basic loading screen\n\n- Added hotkeys</p>
        <h6>v0.0.4</h6><p>- Speed up to all Stages\n- Basic events\n\n- Added numbers format</p>
        <h6>v0.0.3</h6><p>- New content (Accretion)\n- Submerged Stage extended</p>
        <h6>v0.0.2</h6><p>- Stats subtab</p>
        <h6>v0.0.1</h6><p>- Submerged Stage rework\n\n- Mobile device support</p>
        <h6>v0.0.0</h6><p>- First published version\n\n- Submerged Stage placeholder</p>`;
        mainHTML.ariaLabel = 'Versions menu';
        specialHTML.styleSheet.textContent += `#versionHTML h6 { font-size: 1.18em; }
            #versionHTML p { line-height: 1.3em; white-space: pre-line; color: var(--white-text); margin-top: 0.2em; margin-bottom: 1.4em; }
            #versionHTML p:last-of-type { margin-bottom: 0; } `;
    }

    specialHTML.bigWindow = 'version';
    addCloseEvents(getId('versionHTML'));
};

export const openHotkeys = () => {
    if (specialHTML.bigWindow !== null) { return; }
    const mainHTML = buildBigWindow('hotkeysHTML');
    if (mainHTML !== null) {
        mainHTML.innerHTML = `<h3 id="hotkeysMessage" class="bigWord" aria-live="assertive">Highlighted hotkeys can be modified</h3>
        ${globalSave.MDSettings[0] ? `<p>Left or Right swipe ‒ <span class="whiteText">change current tab</span></p>
        <p>Diagonal Down or Up swipe ‒ <span class="whiteText">change current subtab</span></p>
        <p id="stageSwipe">Long Left or Right swipe ‒ <span class="whiteText">change current active Stage</span></p>` : ''}
        <label id="tabRightHotkey"><button type="button" class="selectBtn"></button> ‒ <span class="whiteText">change tab to the next one</span></label>
        <label id="tabLeftHotkey"><button type="button" class="selectBtn"></button> ‒ <span class="whiteText">change tab to the previous one</span></label>
        <label id="subtabUpHotkey"><button type="button" class="selectBtn"></button> ‒ <span class="whiteText">change subtab to the next one</span></label>
        <label id="subtabDownHotkey"><button type="button" class="selectBtn"></button> ‒ <span class="whiteText">change subtab to the previous one</span></label>
        <label id="stageRightHotkey"><button type="button" class="selectBtn"></button> ‒ <span class="whiteText">change active Stage to the next one</span></label>
        <label id="stageLeftHotkey"><button type="button" class="selectBtn"></button> ‒ <span class="whiteText">change active Stage to the previous one</span></label>
        <label id="makeStructureHotkey"><button type="button" class="selectBtn"></button> ‒ <span class="whiteText">make a Structure</span></label>
        <p id="makeAllHotkey"><span></span> <span class="whiteText">or</span> <label><button type="button" class="selectBtn"></button> ‒ <span class="whiteText">make all Structures</span></label></p>
        <label id="enterChallengeHotkey"><button type="button" class="selectBtn"></button> ‒ <span class="whiteText">enter the Challenge</span></label>
        <p id="exitChallengeHotkey"><span></span> <span class="whiteText">or</span> <label><button type="button" class="selectBtn"></button> ‒ <span class="whiteText">exit out of the current Challenge</span></label></p>
        <div>
            <label id="createAllHotkey"><button type="button" class="selectBtn"></button> ‒ <span class="whiteText">Upgrades</span></label>
            <label id="dischargeHotkey" class="orangeText"><button type="button" class="selectBtn"></button> ‒ <span class="whiteText">Discharge</span></label>
            <label id="vaporizationHotkey" class="blueText"><button type="button" class="selectBtn"></button> ‒ <span class="whiteText">Vaporization</span></label>
            <label id="rankHotkey" class="darkorchidText"><button type="button" class="selectBtn"></button> ‒ <span class="whiteText">Rank</span></label>
            <label id="collapseHotkey" class="orchidText"><button type="button" class="selectBtn"></button> ‒ <span class="whiteText">Collapse</span></label>
            <label id="galaxyHotkey" class="grayText"><button type="button" class="selectBtn"></button> ‒ <span class="whiteText">Galaxy</span></label>
            <label id="mergeHotkey" class="darkvioletText"><button type="button" class="selectBtn"></button> ‒ <span class="whiteText">Merge</span></label>
            <label id="nucleationHotkey" class="orangeText"><button type="button" class="selectBtn"></button> ‒ <span class="whiteText">Nucleation</span></label>
            <label id="stageHotkey" class="stageText"><button type="button" class="selectBtn"></button> ‒ <span class="whiteText">Stage</span></label>
            <label id="universeHotkey" class="darkvioletText"><button type="button" class="selectBtn"></button> ‒ <span class="whiteText">Universe</span></label>
            <label id="endHotkey" class="redText"><button type="button" class="selectBtn"></button> ‒ <span class="whiteText">End</span></label>
            <label id="supervoidHotkey" class="darkvioletText"><button type="button" class="selectBtn"></button> ‒ <span class="whiteText">Supervoid</span></label>
            <label id="warpHotkey" class="blueText"><button type="button" class="selectBtn"></button> ‒ <span class="whiteText">Warp</span></label>
            <label id="pauseHotkey" class="grayText"><button type="button" class="selectBtn"></button> ‒ <span class="whiteText">pause</span></label>
        </div>
        <p>Enter <span class="whiteText">or</span> Space ‒ <span class="whiteText">click selected HTML Element or confirm Alert</span></p>
        <p>Escape ‒ <span class="whiteText">cancel changing the hotkey, close Alert or Notification</span></p>
        <p>Tab <span class="whiteText">and</span> Shift Tab ‒ <span class="whiteText">select another HTML Element</span></p>
        <p id="autoTogglesHeader" class="bigWord">Auto toggles</p>
        <label id="toggleStructureHotkey"><button type="button" class="selectBtn"></button> ‒ <span class="whiteText">toggle auto Structure</span></label>
        <p id="toggleAllHotkey"><span></span> <span class="whiteText">or</span> <label><button type="button" class="selectBtn"></button> ‒ <span class="whiteText">toggle all auto Structures</span></label></p>
        <div>
            <label id="toggleUpgradesHotkey"><button type="button" class="selectBtn"></button> ‒ <span class="whiteText">Upgrades</span></label>
            <label id="toggleDischargeHotkey" class="orangeText"><button type="button" class="selectBtn"></button> ‒ <span class="whiteText">Discharge</span></label>
            <label id="toggleVaporizationHotkey" class="blueText"><button type="button" class="selectBtn"></button> ‒ <span class="whiteText">Vaporization</span></label>
            <label id="toggleRankHotkey" class="darkorchidText"><button type="button" class="selectBtn"></button> ‒ <span class="whiteText">Rank</span></label>
            <label id="toggleCollapseHotkey" class="orchidText"><button type="button" class="selectBtn"></button> ‒ <span class="whiteText">Collapse</span></label>
            <label id="toggleMergeHotkey" class="darkvioletText"><button type="button" class="selectBtn"></button> ‒ <span class="whiteText">Merge</span></label>
            <label id="toggleNucleationHotkey" class="orangeText"><button type="button" class="selectBtn"></button> ‒ <span class="whiteText">Nucleation</span></label>
            <label id="toggleStageHotkey" class="stageText"><button type="button" class="selectBtn"></button> ‒ <span class="whiteText">Stage</span></label>
        </div>
        <p>Holding Enter on last selected button will repeatedly press it, also works with Mouse and Touch events on some buttons</p>
        <p>Numlock being ON can break Numpad hotkeys</p>
        <p>Shift clicking the hotkey will remove it</p>
        <label id="hotkeysToggleLabel" title="Turn ON, if using non-QWERTY layout keyboard">Language dependant hotkeys </label>
        <button type="button" id="restoreHotkeys" class="selectBtn">Restore default hotkeys values</button>`; //Spacebar at the end of label is required
        mainHTML.ariaLabel = 'Hotkeys menu';
        const toggle = getId('globalToggle0');
        getId('hotkeysToggleLabel').append(toggle);
        toggle.style.display = '';
        specialHTML.styleSheet.textContent += `#hotkeysHTML { display: flex; flex-direction: column; align-items: center; row-gap: 0.2em; }
            #hotkeysHTML > div { display: grid; grid-template-columns: 1fr 1fr 1fr; width: 100%; gap: 0.3em; }
            #hotkeysHTML > div label { justify-self: center; width: max-content; } `;

        const changeHotkey = async(number: boolean): Promise<string | string[] | null> => {
            return await new Promise((resolve) => {
                getId('hotkeysMessage').textContent = 'Awaiting new value for the hotkey';
                const body = document.documentElement;
                let result: null | string | string[] = null;
                const detect = async(event: KeyboardEvent) => {
                    const { key, code } = event;
                    if (code === 'Tab' || code === 'Enter' || code === 'Space') { return; }
                    event.preventDefault();
                    if (code === 'Escape') { return finish(); }
                    if (key === 'Control' || key === 'Shift' || key === 'Alt') { return; }
                    if (key === 'Meta' || event.metaKey) {
                        getId('hotkeysMessage').textContent = "Meta isn't allowed";
                        return;
                    }
                    let prefix = event.ctrlKey ? 'Ctrl ' : '';
                    if (event.shiftKey) { prefix += 'Shift '; }
                    if (event.altKey) { prefix += 'Alt '; }
                    if (number) {
                        if (code.includes('Digit') || code.includes('Numpad')) {
                            result = prefix + (code.includes('Numpad') ? 'Numpad' : 'Numbers');
                        } else {
                            getId('hotkeysMessage').textContent = 'Only numbers can be used here';
                            return;
                        }
                    } else {
                        if (code.includes('Digit') || code.includes('Numpad')) {
                            const converted = prefix + code.replace('Digit', '').replace('Numpad', 'Num ');
                            result = [converted, converted];
                        } else {
                            result = [key.length === 1 ? key.toUpperCase() : key.replaceAll(/([A-Z]+)/g, ' $1').trimStart(),
                                key.length === 1 ? code.replace('Key', '') : code.replaceAll(/([A-Z]+)/g, ' $1').trimStart()];
                            if (result[0] !== '') {
                                result[0] = prefix + result[0];
                            } else { result[0] = 'None'; }
                            if (result[1] !== '') {
                                result[1] = prefix + result[1];
                            } else { result[1] = 'None'; }
                        }
                    }
                    finish();
                };
                const clickClose = () => {
                    global.hotkeys.disabled = false;
                    finish(false);
                };
                const finish = (keyboard = true) => {
                    body.removeEventListener('keydown', detect);
                    body.removeEventListener('click', clickClose, { capture: true });
                    if (keyboard) {
                        body.addEventListener('keyup', () => { global.hotkeys.disabled = false; }, { once: true });
                    }
                    resolve(result);
                };
                global.hotkeys.disabled = true;
                body.addEventListener('keydown', detect);
                body.addEventListener('click', clickClose, { capture: true });
            });
        };
        const index = globalSave.toggles[0] ? 0 : 1;
        for (const key in globalSaveStart.hotkeys) {
            const button = getQuery(`#${key}Hotkey button`);
            button.textContent = globalSave.hotkeys[key as hotkeysList][index];
            button.addEventListener('click', async(event) => {
                if (event.shiftKey) {
                    if (removeHotkey(globalSave.hotkeys[key as hotkeysList][globalSave.toggles[0] ? 0 : 1]) !== null) {
                        button.textContent = 'None';
                        assignHotkeys();
                        saveGlobalSettings();
                    }
                    return;
                }
                button.style.borderBottomStyle = 'dashed';
                const newHotkey = await changeHotkey(false) as string[];
                if (newHotkey !== null) {
                    const index = globalSave.toggles[0] ? 0 : 1;
                    const removed = removeHotkey(newHotkey[index]);
                    if (removed !== null) { getQuery(`#${removed}Hotkey button`).textContent = 'None'; }
                    button.textContent = newHotkey[index];
                    globalSave.hotkeys[key as hotkeysList] = newHotkey;
                    assignHotkeys();
                    saveGlobalSettings();
                }
                button.style.borderBottomStyle = '';
                getId('hotkeysMessage').textContent = 'Highlighted hotkeys can be modified';
            });
        }
        const extraHotkeyName: Record<string, string> = {
            makeStructure: 'makeAll',
            toggleStructure: 'toggleAll',
            enterChallenge: 'exitChallenge'
        };
        for (const key in globalSaveStart.numbers) {
            const button = getQuery(`#${key}Hotkey button`);
            button.textContent = globalSave.numbers[key as numbersList];
            getQuery(`#${extraHotkeyName[key]}Hotkey span`).textContent = globalSave.numbers[key as numbersList].replace('Numbers', '0').replace('Numpad', 'Num 0');
            button.addEventListener('click', async(event) => {
                if (event.shiftKey) {
                    if (removeHotkey(globalSave.numbers[key as numbersList], true) !== null) {
                        button.textContent = 'None';
                        assignHotkeys();
                        saveGlobalSettings();
                    }
                    return;
                }
                button.style.borderBottomStyle = 'dashed';
                const newHotkey = await changeHotkey(true) as string;
                if (newHotkey !== null) {
                    const removed = removeHotkey(newHotkey, true);
                    if (removed !== null) {
                        getQuery(`#${removed}Hotkey button`).textContent = 'None';
                        getQuery(`#${extraHotkeyName[removed]}Hotkey span`).textContent = 'None';
                    }
                    button.textContent = newHotkey;
                    getQuery(`#${extraHotkeyName[key]}Hotkey span`).textContent = newHotkey.replace('Numbers', '0').replace('Numpad', 'Num 0');
                    globalSave.numbers[key as numbersList] = newHotkey;
                    assignHotkeys();
                    saveGlobalSettings();
                }
                button.style.borderBottomStyle = '';
                getId('hotkeysMessage').textContent = 'Highlighted hotkeys can be modified';
            });
        }
        getId('restoreHotkeys').addEventListener('click', () => {
            globalSave.hotkeys = deepClone(globalSaveStart.hotkeys);
            globalSave.numbers = deepClone(globalSaveStart.numbers);
            const index = globalSave.toggles[0] ? 0 : 1;
            for (const key in globalSave.hotkeys) { getQuery(`#${key}Hotkey button`).textContent = globalSave.hotkeys[key as hotkeysList][index]; }
            for (const key in globalSave.numbers) {
                const value = globalSave.numbers[key as numbersList];
                getQuery(`#${key}Hotkey button`).textContent = value;
                getQuery(`#${extraHotkeyName[key]}Hotkey span`).textContent = value.replace('Numbers', '0').replace('Numpad', 'Num 0');
            }
            assignHotkeys();
            saveGlobalSettings();
        });
    }

    specialHTML.bigWindow = 'hotkeys';
    addCloseEvents(getId('hotkeysHTML'), getQuery('#tabRightHotkey button'));
    visualTrueStageUnlocks();
    visualUpdate();
};

export const openLog = () => {
    if (specialHTML.bigWindow !== null) { return; }
    const mainHTML = buildBigWindow('logHTML');
    if (mainHTML !== null) {
        mainHTML.innerHTML = `<h2 class="whiteText"><span class="biggerWord mainText">Log</span> | <button type="button" id="logOrder" class="selectBtn mainText">Entries on top are newer</button></h2>
        <ul id="logMain"><li></li></ul>`; //Empty <li> is required
        mainHTML.ariaLabel = 'Versions menu';
        specialHTML.styleSheet.textContent += `#logHTML { display: flex; flex-direction: column; }
            #logMain { display: flex; flex-direction: column; text-align: start; border-top: 2px solid; border-bottom: 2px solid; height: 100%; padding: 0.2em 0.4em; margin-top: 0.4em; overflow-y: scroll; overscroll-behavior-y: none; }
            #logMain > li { list-style: inside "‒ "; white-space: pre-line; }
            #logMain.bottom { flex-direction: column-reverse; } /* Cheap way to change the order */`;
        getId('logOrder').addEventListener('click', () => {
            const bottom = getId('logMain').classList.toggle('bottom');
            getId('logOrder').textContent = `Entries on ${bottom ? 'bottom' : 'top'} are newer`;
        });
    }

    specialHTML.bigWindow = 'log';
    addCloseEvents(getId('logHTML'));
    visualUpdate();
};

//Cheats functions
export const getPrebuiltSave = (): string => {
    return 'eyJ2ZXJzaW9uIjoidjAuMi43IiwiZmlsZU5hbWUiOiJGdW5kU2F2ZSBbZGF0ZU0vRC9ZXSwgdVt1bml2ZXJzZV0sICBbY29zbW9uXSBjb3Ntb25zIiwic3RhZ2UiOnsidHJ1ZSI6OCwiY3VycmVudCI6NiwiYWN0aXZlIjo2LCJyZXNldHMiOjEyNCwidGltZSI6MTA4ODEwMTk2LjA2MjI0NDM0LCJwZWFrIjoxMDc1MTIwNTQ2MDY1LjI4NDksImlucHV0Ijo4NDAsInBlYWtlZEF0Ijo3NzMuNzE5OTk5OTk5NTg2M30sImRpc2NoYXJnZSI6eyJlbmVyZ3kiOjgxMjkwNTQsImVuZXJneU1heCI6ODEyOTA1NCwiY3VycmVudCI6Mjh9LCJ2YXBvcml6YXRpb24iOnsiY2xvdWRzIjoxLjMyODk3MTgzNTczOTc2MTRlKzQ2LCJjbG91ZHNNYXgiOjEuMzI4OTcxODM1NzM5NzYxNGUrNDYsImlucHV0IjpbNSwwXX0sImFjY3JldGlvbiI6eyJyYW5rIjo3fSwiY29sbGFwc2UiOnsibWFzcyI6MjQyNjE2NTMxNC42NTY0Njg0LCJtYXNzTWF4IjoyNDQxNDg4MTQ4LjUyOTEyNTcsInN0YXJzIjpbNjc3OCwzOTQwLDg1NTRdLCJzaG93IjozNSwibWF4RWxlbWVudCI6MzUsImlucHV0IjpbMiwxMDAwMDAwXSwicG9pbnRzIjpbMC4wNzYsMC4zLDUsMTAsNDAsMS43ZSszMDhdfSwibWVyZ2UiOnsicmVzZXRzIjoxMCwiaW5wdXQiOlsxMDEsMTVdLCJzaW5jZSI6NTc3MS40NDAwMDAwMjI0MjIsInJld2FyZHMiOlszMSwxMCwwLDBdLCJjbGFpbWVkIjpbMCwwXX0sImRhcmtuZXNzIjp7ImVuZXJneSI6MTAwMCwiZmx1aWQiOjE4LjkyNTgzNDYxMTMyNjY2NCwiaW5wdXQiOjEuNX0sImluZmxhdGlvbiI6eyJsb2Fkb3V0cyI6W1siQmFzaWMiLFsxLDBdXV0sInZhY3V1bSI6dHJ1ZSwicmVzZXRzIjoxMywidGltZSI6MzU0MzAyMjE1LjI3NjE2NjMsImFnZSI6MzU0NTA5OTE2LjMzNTg3ODg1LCJ2b2lkVmVyc2VzIjowLCJlbmRzIjpbMiw2LDZdfSwidGltZSI6eyJ1cGRhdGVkIjoxNzYwNTU0OTAzNjM3LCJzdGFydGVkIjoxNzQ0NDczNzgyNDU0LCJleHBvcnQiOlswLDAsMF0sIm9mZmxpbmUiOjYzNzk0NTYuODM4MzA1NTUyLCJvbmxpbmUiOjQ3NDQyNjM5MTkuMzIyODIyLCJzdGFnZSI6NzU1My40NjAwMDAwNDc5MTQsInZhY3V1bSI6MTMwNjc3LjQ3MDAwOTUwMTA2LCJ1bml2ZXJzZSI6MTMxNDE2LjU1MDAwOTUzNDY0LCJleGNlc3MiOjAsImVuZCI6NjI0MjkyLjgzMTE0Mjg4Nzh9LCJidWlsZGluZ3MiOltbXSxbeyJjdXJyZW50IjpbNS4zODg3OTc2MjU3ODc2NiwyMDJdLCJ0b3RhbCI6WzEuMDkzNjczNDI1MDQwMTMsMjA0XSwidHJ1ZVRvdGFsIjpbMS4wOTM2NzUzNjk0MTMzMywyMDRdfSx7InRydWUiOjMzNzksImN1cnJlbnQiOlsyLjkzMDczODEwNjkxMTE2LDEyODBdLCJ0b3RhbCI6WzIuOTMwNzM4MTA2OTExMTYsMTI4MF0sInRydWVUb3RhbCI6WzIuOTMwNzM4MTA2OTExMTYsMTI4MF19LHsidHJ1ZSI6MjEwODMsImN1cnJlbnQiOls4LjQzMjk2NDY5NTY0NDgzLDcwOF0sInRvdGFsIjpbOC40MzI5NjQ2OTU2NDQ4Myw3MDhdLCJ0cnVlVG90YWwiOls4LjQzMjk2NDY5NTY0NDgzLDcwOF19LHsidHJ1ZSI6MTE2OTIsImN1cnJlbnQiOlsxLjUyMzg5MzA5MDgxMTUyLDM3NF0sInRvdGFsIjpbMS41MjM4OTMwOTA4MTE1MiwzNzRdLCJ0cnVlVG90YWwiOlsxLjUyMzg5MzA5MDgxMjA5LDM3NF19LHsidHJ1ZSI6NjE3NywiY3VycmVudCI6WzEuNzI0MDE1MDE2OTQyNDMsMTc4XSwidG90YWwiOlsxLjcyNDAxNTAxNjk0MjQzLDE3OF0sInRydWVUb3RhbCI6WzEuNzI0MDE2NTcwMDEzNjksMTc4XX0seyJ0cnVlIjoyOTI5LCJjdXJyZW50IjpbOS42MTczMzI0NjA4ODMyNCw2NF0sInRvdGFsIjpbMS4zOTUxNTYwMzY4NDEzOSw2Nl0sInRydWVUb3RhbCI6WzEuNDAyMjY5MTA3OTkzOTksNjZdfV0sW3siY3VycmVudCI6WzEuNTk2OTk1NjI3MzI5NTgsNDFdLCJ0b3RhbCI6WzAsMF0sInRydWVUb3RhbCI6WzAsMF19LHsidHJ1ZSI6NzI2LCJjdXJyZW50IjpbMS45MDI0Mzg4OTIxNDg3OSw5Nl0sInRvdGFsIjpbMy4zNzQ3Mzk2MTUwMDU3Miw5N10sInRydWVUb3RhbCI6WzMuMzc1MTE5NDU2NTYzOTIsOTddfSx7InRydWUiOjExOTEsImN1cnJlbnQiOlsxLjk1MzEsNF0sInRvdGFsIjpbMS4xOTEsM10sInRydWVUb3RhbCI6WzUuMDM3ODU2LDZdfSx7InRydWUiOjkyMiwiY3VycmVudCI6WzQuNTg1LDNdLCJ0b3RhbCI6WzkuMjIsMl0sInRydWVUb3RhbCI6WzMuODg3OTk1LDZdfSx7InRydWUiOjYwMSwiY3VycmVudCI6WzEuMjIxLDNdLCJ0b3RhbCI6WzYuMDEsMl0sInRydWVUb3RhbCI6WzIuNDUxMjAyLDZdfSx7InRydWUiOjUwMiwiY3VycmVudCI6WzYuMiwyXSwidG90YWwiOls1LjAyLDJdLCJ0cnVlVG90YWwiOlsyLjAyNjc0OSw2XX0seyJ0cnVlIjoxMTgsImN1cnJlbnQiOlsxLjE4LDJdLCJ0b3RhbCI6WzEuMTgsMl0sInRydWVUb3RhbCI6WzQuNzgzOTcsNV19XSxbeyJjdXJyZW50IjpbOS42MDY0MDQzMjIwNzgwNywxNjldLCJ0b3RhbCI6WzEuOTQ5NjQ5OTY3NzM1MDEsMTcxXSwidHJ1ZVRvdGFsIjpbOS43NjE4NTY2NzM5MiwtMzZdfSx7InRydWUiOjMzMDAsImN1cnJlbnQiOlszLjI3OTM0MzU3MzE5NDQzLDkzXSwidG90YWwiOlszLjI3OTM0MzU3MzE5NDQzLDkzXSwidHJ1ZVRvdGFsIjpbMy4yNzk0NDUxNTk2MjAwMSw5M119LHsidHJ1ZSI6MTk2NCwiY3VycmVudCI6WzQuNTM1MzA5NTYwNjgyMzMsNDJdLCJ0b3RhbCI6WzQuNTM1MzA5NTYwNjgyMzMsNDJdLCJ0cnVlVG90YWwiOls0LjU2MjczODYxMjA0NDI5LDQyXX0seyJ0cnVlIjoxMjMwLCJjdXJyZW50IjpbMS4yMywzXSwidG90YWwiOlsxLjIzLDNdLCJ0cnVlVG90YWwiOlsxLjEzNzI3LDZdfSx7InRydWUiOjIzNSwiY3VycmVudCI6WzIuMzUsMl0sInRvdGFsIjpbMi4zNSwyXSwidHJ1ZVRvdGFsIjpbMS45MDY3LDVdfSx7InRydWUiOjE2MCwiY3VycmVudCI6WzEuNiwyXSwidG90YWwiOlsxLjYsMl0sInRydWVUb3RhbCI6WzEuMzE5OCw1XX1dLFt7ImN1cnJlbnQiOlszLjUyODE1OTg5MzMyMTM0LDc1Ml0sInRvdGFsIjpbNi43NzAzMTAxMzgyNTUwOCw3NTNdLCJ0cnVlVG90YWwiOls2Ljc3MDMxMDEzODI1NTYyLDc1M119LHsidHJ1ZSI6Nzg5MywiY3VycmVudCI6WzEuMDExMzc4NTcxMjIwNzcsMTQ5XSwidG90YWwiOlsxLjAxMTM3ODU3MTIyMDc3LDE0OV0sInRydWVUb3RhbCI6WzEuMDEyODMyMTkxNjQyNTIsMTQ5XX0seyJ0cnVlIjo1MjAwLCJjdXJyZW50IjpbMi41Mjg0NDY0MjgwNTEzMiwxNDhdLCJ0b3RhbCI6WzIuNTI4NDQ2NDI4MDUxMzIsMTQ4XSwidHJ1ZVRvdGFsIjpbMi41MzIwODA0NzkxMDU0OCwxNDhdfSx7InRydWUiOjM5NDAsImN1cnJlbnQiOls2LjMyMTExNjA3MDEyODIxLDE0N10sInRvdGFsIjpbNi4zMjExMTYwNzAxMjgyMSwxNDddLCJ0cnVlVG90YWwiOls2LjMzMDIwMTE5Nzc2NDQ5LDE0N119LHsidHJ1ZSI6MzIwMiwiY3VycmVudCI6WzEuNTgwMjc5MDE3NTMyMDIsMTQ3XSwidG90YWwiOlsxLjU4MDI3OTAxNzUzMjAyLDE0N10sInRydWVUb3RhbCI6WzEuNTgyNTUwMjk5NDQxMTcsMTQ3XX0seyJ0cnVlIjoyNjc2LCJjdXJyZW50IjpbMy45NTA2OTc1NDM4Mjk0LDE0Nl0sInRvdGFsIjpbMy45NTA2OTc1NDM4Mjk0LDE0Nl0sInRydWVUb3RhbCI6WzMuOTU2Mzc1NzQ4NjAyMDcsMTQ2XX1dLFt7ImN1cnJlbnQiOlswLDBdLCJ0b3RhbCI6WzAsMF0sInRydWVUb3RhbCI6WzAsMF19LHsidHJ1ZSI6MjMzNSwiY3VycmVudCI6WzIuMzM1LDNdLCJ0b3RhbCI6WzIuMzM1LDNdLCJ0cnVlVG90YWwiOls3Ljk1MzUyLDVdfSx7InRydWUiOjIzMjEsImN1cnJlbnQiOlsyLjMyMSwzXSwidG90YWwiOlsyLjMyMSwzXSwidHJ1ZVRvdGFsIjpbNy44MjU1Miw1XX0seyJ0cnVlIjoxMDcsImN1cnJlbnQiOlsxLjE1NywzXSwidG90YWwiOlsxLjE1NywzXSwidHJ1ZVRvdGFsIjpbMS4xNTcsM119XSxbeyJjdXJyZW50IjpbOS45Nzk2NzI2NjE4OTc4NywxOV0sInRvdGFsIjpbMS4wMTkyMjczNTM0NTA3OSwyMV0sInRydWVUb3RhbCI6WzEuNDYyMjY4OTkxMTU5NzgsMjFdfSx7ImN1cnJlbnQiOlsyLDJdLCJ0b3RhbCI6WzIsMl0sInRydWVUb3RhbCI6WzMuMjQ1LDNdLCJ0cnVlIjoyMDB9XV0sInZlcnNlcyI6W3sidHJ1ZSI6NiwiY3VycmVudCI6NywidG90YWwiOjEyfV0sInN0cmFuZ2UiOlt7ImN1cnJlbnQiOjI5NjA1OTE5OTQyMTE3MjkyLCJ0b3RhbCI6NTQ2MDU5MjAxMDkzNDA2NjB9LHsiY3VycmVudCI6NzYzNzA1NzkzNzkwNjA0LjUsInRvdGFsIjo3NjM3MDU3OTM3OTA2NDAuNX1dLCJjb3Ntb24iOlt7ImN1cnJlbnQiOjAsInRvdGFsIjozN30seyJjdXJyZW50IjowLCJ0b3RhbCI6MTN9XSwidXBncmFkZXMiOltbXSxbMSwxLDEsMSwxLDEsMSwxLDEsMSwxXSxbMSwxLDEsMSwxLDEsMSwxLDFdLFsxLDEsMSwxLDEsMSwxLDEsMSwxLDEsMSwxLDFdLFsxLDEsMSwxLDEsMF0sWzEsMSwxLDEsMSwxLDFdLFsxLDFdXSwicmVzZWFyY2hlcyI6W1tdLFs1LDQsOCwyLDQsM10sWzgsOCw3LDUsMywyLDBdLFs5LDMsOCw4LDIsMiw2LDQsNF0sWzQ4LDEyLDIsMSwyLDJdLFs0LDQsOCw4LDRdLFs4LDE4LDksNSw0XV0sInJlc2VhcmNoZXNFeHRyYSI6W1tdLFsxLDQsMiw0LDEsMl0sWzEsMywxLDMsM10sWzQ3LDgsMSw1LDUsMl0sWzMsMSwxLDEsMF0sWzEsMiw4LDIsMiwxXSxbNCwyLDgsNF1dLCJyZXNlYXJjaGVzQXV0byI6WzMsMiw1XSwiQVNSIjpbMCw1LDYsNSw1LDMsMV0sImVsZW1lbnRzIjpbMSwxLDEsMSwxLDEsMSwxLDEsMSwxLDEsMSwxLDEsMSwxLDEsMSwxLDEsMSwxLDEsMSwxLDEsMSwxLDEsMSwxLDEsMSwxLDEsMF0sInN0cmFuZ2VuZXNzIjpbW10sWzEwLDQsNCw2LDIsMSwxLDIsMiwxXSxbNCwxMiwzLDYsMiwxLDEsNiwzLDFdLFsxMiw4LDMsMSwyLDEsMywxLDYsMV0sWzEyLDgsMywyLDIsMSwyLDEsOCwzXSxbOCw4LDYsMSwxLDEsMSwxLDEsMSwzXSxbMSwwLDAsMV1dLCJtaWxlc3RvbmVzIjpbW10sWzMxLDI3XSxbMjMsMjFdLFsyOCwyN10sWzMwLDMwXSxbMzAsMzBdXSwidHJlZSI6W1syLDYsNSwyLDEsMV0sWzIsMiwxLDAsMiwwLDEsMCwxLDBdXSwiY2hhbGxlbmdlcyI6eyJhY3RpdmUiOm51bGwsInN1cGVyIjp0cnVlLCJ2b2lkIjpbMCwzLDMsNiw1LDJdLCJzdXBlcnZvaWQiOlswLDMsMCw1LDAsMF0sInZvaWRDaGVjayI6WzAsMywzLDYsNSwyXSwic3RhYmlsaXR5IjoxLCJzdXBlcnZvaWRNYXgiOlswLDMsMCw1LDAsMF19LCJ0b2dnbGVzIjp7Im5vcm1hbCI6W3RydWUsdHJ1ZSx0cnVlLHRydWUsZmFsc2VdLCJjb25maXJtIjpbIlNhZmUiLCJTYWZlIiwiU2FmZSIsIlNhZmUiLCJTYWZlIiwiU2FmZSIsIlNhZmUiLCJTYWZlIl0sImJ1aWxkaW5ncyI6W1tdLFt0cnVlLHRydWUsdHJ1ZSx0cnVlLHRydWUsdHJ1ZV0sW3RydWUsdHJ1ZSx0cnVlLHRydWUsdHJ1ZSx0cnVlLHRydWVdLFt0cnVlLHRydWUsdHJ1ZSx0cnVlLHRydWUsdHJ1ZV0sW3RydWUsdHJ1ZSx0cnVlLHRydWUsdHJ1ZSx0cnVlXSxbdHJ1ZSx0cnVlLHRydWUsdHJ1ZV0sW2ZhbHNlLHRydWVdXSwiaG92ZXIiOltmYWxzZSxmYWxzZSxmYWxzZV0sIm1heCI6W2ZhbHNlLGZhbHNlLGZhbHNlXSwiYXV0byI6W2ZhbHNlLHRydWUsdHJ1ZSx0cnVlLHRydWUsdHJ1ZSx0cnVlLHRydWUsdHJ1ZSx0cnVlLGZhbHNlXSwic2hvcCI6eyJpbnB1dCI6MCwid2FpdCI6WzIsMSwxLDEsMSwxLDEuMV19LCJ2ZXJzZXMiOltmYWxzZV19LCJoaXN0b3J5Ijp7InN0YWdlIjp7ImJlc3QiOls4NzAuMDE5OTk5OTk5NDk4Nyw4NzEwNTE2OTYyMzQ3NjguOCwxNDkxMjY1NjAyMjM3OC4xOTMsMTA1ODk0NjU5NDM0MC44NjM4LDc4Mi45OTk5OTk5OTk1Nzc5XSwibGlzdCI6W1s4NzAuMDE5OTk5OTk5NDk4Nyw4NzEwNTE2OTYyMzQ3NjguOCwxNDkxMjY1NjAyMjM3OC4xOTMsMTA1ODk0NjU5NDM0MC44NjM4LDc4Mi45OTk5OTk5OTk1Nzc5XSxbODcwLjAxOTk5OTk5OTQ5ODcsODUzODA5Mzk3MDI4NTIyLjEsMTQ2MTcyNzg1MzIyNjUuODMyLDEwNDcxMDcxNTg1NjUuMjcyMSw3NzkuOTU5OTk5OTk5NTgwNl0sWzg3MC4wMTk5OTk5OTk0OTg3LDg0MTAyMDYzMjQ2OTkwMC42LDE0Mzk4MjQxODc5Nzg2Ljk1MywxMDIyNTM1NDIwMjc0LjYxMjcsNzc3LjU1OTk5OTk5OTU4MjhdLFs4NzAuMDE5OTk5OTk5NDk4Nyw4MjU0NzMyMzg2NDcwMjQuOCwxNDEzMTkwOTU5ODU1MS4xODQsMTAwNjk3MTQyODQ1Ny45NjAxLDc3Ny4zNTk5OTk5OTk1ODNdLFs4NzAuMDE5OTk5OTk5NDk4Nyw4MTk0NzU2MDAzNDE5NDQsMTQwMjkyNTM5NzMyNzkuOTEyLDk5NDYwNDEwMjY2NS44MDE4LDc4My42Mzk5OTk5OTk1NzczXSxbODcwLjAxOTk5OTk5OTQ5ODcsODE3MzU2NTY3MzgzNTYxLjksMTM5OTMwMzIyODcxODkuMTI1LDEwMDI5NDcwNTAzMDQuNTA3Nyw3NzAuODc5OTk5OTk5NTg4OV0sWzg3MC4wMTk5OTk5OTk0OTg3LDc5NTU1NTI1Mzc4NTQzNC44LDEzNjE5NzMyMzI3NTg5LjMyOCw5NzI4MjA4MTMzNTEuNzc5Nyw3ODAuNjc5OTk5OTk5NThdLFs4NzAuMDE5OTk5OTk5NDk4Nyw3ODc3MjQyNzE0ODM1MjQuNCwxMzQ4NTY1MDMyMjA1Mi4zNyw5NjA0MDU4OTMwODguNDIzOCw3ODMuODk5OTk5OTk5NTc3MV0sWzg3MC4wMTk5OTk5OTk0OTg3LDc3OTg0OTIxNTI0NTE3MC4xLDEzMzUwODE0NzA4NjAwLjY1NCw5NDg1MTE0MzU1MDEuMjk5Miw3ODYuNzk5OTk5OTk5NTc0NF0sWzg3MC4wMTk5OTk5OTk0OTg3LDc3MTE4NjkzMzYzODgwNy40LDEzMjAyNDg1MDAwODQ1LjA2NCw5MzQzNTk4NjkxNzguNTE0Miw3OTIuNzM5OTk5OTk5NTY5XSxbODcwLjAxOTk5OTk5OTQ5ODcsNzY2NDQ4MzExODA0OTI2LjQsMTMxMjE0MTQ1MDIwNDUuNjU4LDkzNzI0NTI2NDE0MS4wNTQzLDc4MS4wOTk5OTk5OTk1Nzk2XSxbODcwLjAxOTk5OTk5OTQ5ODcsNzU3MDg3MDk4MDE5NzIyLjIsMTI5NjExMTE1MzczNzYuOTg4LDkyMTE5NjA5NDE1Mi40NDcsNzg3LjQxOTk5OTk5OTU3MzldLFs4NzAuMDE5OTk5OTk5NDk4Nyw3NTQ2NDE4Mjk3MDU0ODAuNiwxMjkxOTM0NDI2Mjk1Ny4zODcsOTQyNTE3MjM2MDk0LjI1Miw3NjEuMzc5OTk5OTk5NTk3NV0sWzg3MC4wMTk5OTk5OTk0OTg3LDc0NjMwNDY2OTY0Njk3OC4xLDEyNzc2NTk5MjIzMzA1LjgwNSw5Mjc0MTg0NzgyNTIuNjQ5Nyw3NjUuMzk5OTk5OTk5NTkzOV0sWzg3MC4wMTk5OTk5OTk0OTg3LDc0MDAyOTMyODg4NTc4OCwxMjY2OTE5MjI2MDg0OC44NTQsOTI0NjM0MTIwMzI3LjcwMzksNzUzLjIxOTk5OTk5OTYwNV0sWzg3MC4wMTk5OTk5OTk0OTg3LDczMTM4NTk3NjI3Nzk5Mi44LDEyNTIxMTk0MjE3Njc5LjkzOCw5MTAxNTMzMzQ4NTIuNzkyOCw3NTYuNzU5OTk5OTk5NjAxN10sWzg3MC4wMTk5OTk5OTk0OTg3LDcyNDYwNzI3ODI2MTE0NCwxMjQwNTE0NjI5NTI0My4xMDIsODk5ODQ2NzA0OTI4LjI5ODYsNzU4LjQxOTk5OTk5OTYwMDJdLFs4NzAuMDE5OTk5OTk5NDk4Nyw3MTU2NzUwMTMwNDc2OTcsMTIyNTIyMDQ2MjgwNjEuMTY2LDg4NzMxMTkyOTI1Mi41ODg1LDc2MC42Mzk5OTk5OTk1OTgyXSxbODcwLjAxOTk5OTk5OTQ5ODcsNzA3MjA4NDMwMDE3MzI5LjYsMTIxMDcyMzY3ODAzMjcuMjQsODc1MDAwMzQzNTQ2LjM2NzgsNzYzLjU5OTk5OTk5OTU5NTVdLFs4NzAuMDE5OTk5OTk5NDk4Nyw3MDA2OTIwMzIwMTg2MTYuNSwxMTk5NTY4Mzc3ODI3MC43NSw4NjQ2MjM1NTQ4NDYuMjY4MSw3NjQuNzk5OTk5OTk5NTk0NF1dLCJpbnB1dCI6WzIwLDEwMF19LCJlbmQiOnsiYmVzdCI6WzEwMjk4MjQuMDYxMjg2MjcyLDddLCJsaXN0IjpbWzEwMjk4MjQuMDYxMjg2MjcyLDddLFszMTM4NzA5LjIwNjYxMjMyMzQsNl1dLCJpbnB1dCI6WzIwLDEwMF19fSwiZXZlbnQiOmZhbHNlLCJjbG9uZSI6e319';
}

export const loadSaveA = (): void => {
    const prebuiltSaves = getPrebuiltSave();
    loadGame(prebuiltSaves);
}

export const cheatStrangeQuarks = (): void => {
    player.strange[0].current *= 10;
    player.strange[0].total *= 10;
    numbersUpdate();
    visualUpdate();
}

export const cheatStrangelets = (): void => {
    player.strange[1].current *= 10;
    player.strange[1].total *= 10;
    numbersUpdate();
    visualUpdate();
}

export const cheatInflations = (): void => {
    player.cosmon[0].current += 1;
    player.cosmon[0].total += 1;
    numbersUpdate();
    visualUpdate();
}

export const cheatCosmons = (): void => {
    player.cosmon[1].current += 1;
    player.cosmon[1].total += 1;
    numbersUpdate();
    visualUpdate();
}