import { formatCurrency } from '../utils/currency';

const baseProducts = [
  {
    id: "the-circlet-of-whispering-fate",
    name: "The Circlet Of Whispering Fate",
    price: null,
    priceDisplay: "COMING SOON",
    image: "/images/the-circlet-of-whispering-Fate.png",
    comingSoon: true,
    category: "headgear",
    descShort: "A prophetic circlet of starlight silver studded with pulsing opals.",
    descLong: `TThe Circlet of Whispering Fate is a delicate yet potent crown, forged from starlight silver that gleams with a soft, iridescent sheen. It is crafted as an interwoven band of vines, symbolizing the tangled, intricate pathways of destiny. Instead of large gems, the circlet is studded with dozens of tiny, uncut opals that pulse with a faint inner light, each said to represent a critical crossroad in time. The most unique feature is the minute, almost invisible etching along the inner band—these are the whispers themselves, arcane symbols that change subtly based on the wearer's current direction in life.

    This artifact is one of profound prophecy and existential guidance, used by those whose decisions alter the course of history. When worn, the Circlet silences the noise of the mundane world, granting the wearer a rare form of intuitive insight—not a direct vision of the future, but a deep, resonant understanding of the consequences of their choices. It allows the wearer to perceive the subtle flow of destiny, acting as a profound psychic compass that guides them along the most significant path. It is the perfect tool for a leader who seeks not to control fate, but to navigate it with absolute precision.`
  },
  {
    id: "the-cuff-of-frozen-moonlight",
    name: "The Cuff Of Frozen Moonlight",
    price: 11999,
    image: "/images/the-cuff-of-frozen-moonlight.png",
    category: "glove",
    descShort: "Glacial meteoric cuff with the Frozen Moonstone — cold elegance.",
    descLong: `The Cuff of Frozen Moonlight is masterfully forged from pure, glacial meteoric silver, its surface shimmering with the cool, blue-white luminescence of a winter night's frost. Its design is one of arresting, cold elegance, featuring delicate engravings that mimic hoarfrost tendrils and the faint outlines of the northern constellations. At its heart lies the 'Frozen Moonstone,' a singular gem that does not emit light, but rather captures and eternally suspends it, appearing like a fragment of timeless snowfall trapped within crystal, symbolizing an enduring and unchangeable truth.

    More than mere adornment, this artifact is renowned for its silent strength and absolute certainty, often serving as the emblem of a ruler who governs by unwavering wisdom. The cuff remains perpetually cold to the touch, a quality that stills the wearer's passions and compels them to approach every decision with glacial composure. Legend holds that it was forged during a total lunar eclipse, granting its owner an unshakeable clarity of mind and the power to see through the world's illusions, viewing all things under the honest, eternal light of the moon.`
  },
  {
    id: "the-gilded-gauntlets-of-the-sky-watcher",
    name: "The Gilded Gauntlets Of The Sky Watcher",
    price: 7999,
    image: "/images/the-gilded-gauntlets-of-the-sky-watcher.png",
    badge: "UP TO 30% OFF",
    category: "glove",
    descShort: "Gilded gauntlets with Star Compass — celestial guidance.",
    descLong: `The Gilded Gauntlets of the Sky-Watcher are pieces of magnificent, articulated armor forged from the purest celestial bronze and lavishly plated with solar gold. Each finger joint and knuckle is reinforced with miniature, interlocking plates that provide both flexibility and complete protection. Embedded within the center of each gauntlet's back is a circular 'Star Compass,' a mesmerizing arrangement of tiny, rotating sapphires that subtly shift to mirror the celestial bodies overhead, ensuring that the wearer is always oriented with absolute cosmic precision. The inner palms are inscribed with ancient navigation runes, offering both a firm grip and the quiet assurance of unwavering direction.

    These gauntlets are more than defensive gear; they symbolize the power of one who holds dominion over both the earthly and celestial realms. When donned, they grant the wearer unmatched confidence and an intuitive connection to the heavens, allowing them to feel the movements of the cosmos and make decisions with divine alignment. It is said that those who wear the Gauntlets can point toward their destiny with absolute certainty, their hands becoming extensions of the stars themselves. They are the ultimate emblem of a ruler who guides their realm with celestial wisdom and unerring purpose.`
  },
  {
    id: "the-grand-seal-of-lumina",
    name: "The Grand Seal Of Lumina",
    price: 6999,
    image: "/images/the-grand-seal-of-lumina.png",
    badge: "UP TO 30% OFF",
    category: "ring",
    descShort: "A solar-gilded bronze seal — emblem of lawful sovereignty.",
    descLong: `The Grand Seal of Lumina is a disc of flawless, polished bronze, meticulously plated with solar gold harvested from ancient, forgotten mines. Its weight is significant, a tangible testament to the authority it represents. Engraved upon its face is a complex, symmetrical motif: a stylized depiction of the First Sunrise, where radiating lines of power emanate from a central, uncut diamond—the 'Eye of Dawn.' The Seal is held by a winding handle of obsidian, ensuring that the earthly darkness serves the celestial light, and its edges are ringed with inscriptions of protective, ancient Lumina script.

    This artifact is the absolute emblem of lawful sovereignty and unquestionable mandate. Legend claims that any document authenticated by the Lumina Seal is irreversible, carrying the weight of the cosmos. Holding it instills a sense of profound responsibility and unwavering confidence in the wielder, banishing doubt and cowardice. It is said to faintly pulse with inner warmth, a reminder that true power lies not in shadow, but in the brilliance of transparent and just rule.`
  },
  {
    id: "the-mantle-of-etheral-reign",
    name: "The Mantle Of Ethereal Reign",
    price: 5999,
    image: "/images/the-mantle-of-etheral-reign.png",
    category: "cape",
    descShort: "A moonlight-woven mantle — ethereal majesty.",
    descLong: `The Mantle of Ethereal Reign is a magnificent cloak woven from threads spun by the moonlight itself, giving it an appearance that is simultaneously substantial and translucent. Its color shifts subtly, phasing between deep indigo, pale silver, and the faint violet of twilight, making the wearer appear to be standing just beyond the veil of reality. The fabric is impossibly light, yet holds the weight of immense power, trimmed along its edges with delicate, shimmering lacework that appears to be captured starlight. When worn, the mantle seems to billow slightly even in still air, creating an illusion of eternal, quiet motion.

    This garment is the ultimate symbol of rule transcending the physical plane. It does not offer physical defense, but grants the wearer an unparalleled sense of authority and detachment. The Mantle's presence subtly silences discord and instills profound awe in observers, making earthly resistance seem trivial. It is said that wearing it provides the sovereign with ethereal insight, allowing them to perceive hidden truths and guide their realm with wisdom drawn directly from the higher spheres, establishing a reign defined by grace and untouchable majesty.`
  },
  {
    id: "the-scepter-of-silent-majesty",
    name: "The Scepter Of Silent Majesty",
    price: 9999,
    image: "/images/the-scepter-of-silent-majesty.png",
    category: "staff",
    descShort: "Ebonywood staff crowned with the Ruby of Unspoken Oaths.",
    descLong: `The Scepter of Silent Majesty is crafted from ebonywood sourced from the deepest celestial groves, giving it a profound, matte black finish that absorbs ambient light. Its head is a breathtaking crown of wrought gold, sculpted into the form of graceful, upward-sweeping wings, symbolizing ascension and eternal watchfulness. Nestled within these wings is the central focal point: an immense, flawless Ruby of Unspoken Oaths, faceted to catch light only dimly, emphasizing its rich, dark crimson hue. The shaft of the scepter is inlaid with subtle silver script, detailing the names of forgotten dynasties who reigned with unparalleled grace.

    This relic is not a weapon of war, but the absolute instrument of undisputed, tranquil authority. True to its name, the scepter grants the wielder power through quiet command rather than vocal decree; those who hold it find their presence instantly compelling and their silence more intimidating than any shout. It embodies the essence of a ruler who possesses perfect self-control and deep inner peace, ensuring that all edicts passed under its watch are characterized by solemn wisdom and irrevocable finality.`
  },
  {
    id: "the-runebound-claymore-of-the-earthforger",
    name: "The Runebound Claymore of the Earthforger",
    price: 7999,
    badge: "NEW!",
    image: "/images/The Runebound Claymore of the Earthforger.png",
    category: "sword",
    descShort: "Mountain-forged claymore with primordial earth runes — unbreakable strength.",
    descLong: `The Runebound Claymore of the Earthforger is a colossal two-handed blade forged in the deepest mountain forges where the earth's molten heart still burns. Its thick, imposing blade is crafted from primordial iron ore, darkened to a deep charcoal gray and etched with glowing amber runes that pulse with the heartbeat of tectonic forces. The crossguard is shaped like jagged mountain peaks, cast from bronze and reinforced with veins of pure obsidian. The grip is wrapped in aged leather over petrified dragonbone, and the pommel holds a massive, rough-cut topaz that channels the raw power of the earth itself.

    This weapon is the ultimate symbol of immovable strength and unyielding resolve. Each strike carries the weight of mountains, and the runic inscriptions ensure that the blade never dulls, chips, or breaks—it is as eternal as the stone from which it draws power. The Earthforger grants its wielder supernatural endurance and the ability to stand firm against any force, making them an unshakeable pillar of strength in battle. It is said that when this claymore strikes the ground, it can cause tremors that ripple through the battlefield, a testament to the primal, unstoppable power it commands.`
  },
  {
    id: "the-blade-of-final-resonance",
    name: "The Blade Of Final Resonance",
    price: 7999,
    badge: "NEW!",
    image: "/images/the-blade-of-final-resonance.png",
    category: "sword",
    descShort: "Star-iron sword of ultimate silence. Ensures instant, irreversible destiny.",
    descLong: `The Blade of Final Resonance is an awe-inspiring two-handed sword forged from star-iron and quenched in the ethereal silence of a celestial vacuum. Its long, sleek blade possesses an almost mirror-like finish, but upon closer inspection, it holds a faint, internal shimmer of violet energy, a visible manifestation of the sound it suppresses. The crossguard is elegantly crafted from polished obsidian and set with small, dark sapphires, designed to minimize vibration. The pommel features a heavy, dark crystal known as the "Sunder Stone," which anchors the weapon's unique power.

    This blade is the ultimate expression of commitment and unavoidable consequence. It is said that when this sword is drawn, all surrounding noise seems to diminish, leading to a profound, unsettling silence. When the blade strikes, it generates a "Final Resonance"—not a physical sound, but a metaphysical wave that targets the deepest doubts and hesitations of the enemy. It compels absolute resolution; the wielder must strike with complete conviction, as the blade ensures that the outcome, whether victory or defeat, is instant, decisive, and irreversible. It is a terrifying tool reserved for moments when destiny itself must be sealed.`
  },
  {
    id: "the-cryptic-tome of-the-void",
    name: "The Cryptic Tome Of The Void",
    price: 12999,
    image: "/images/the-cryptic-tome of-the-void.png",
    category: "book",
    descShort: "Ancient book containing a glimpse of the cosmic void. Grants perilous, ultimate insight.",
    descLong: `The Cryptic Tome of the Void is a chillingly ancient book, its binding crafted from petrified dragon hide and reinforced with heavy, corroded iron chains that secure its enigmatic secrets. The cover is a canvas of forgotten symbols and faint, undulating glyphs that seem to shift in peripheral vision. At its heart lies a sunken, angular window of black crystal, through which a miniature, swirling cosmic void can be seen—a captivating, yet unsettling glimpse into oblivion. The pages within are rumored to be made of solidified shadow, inscribed with impossible script that challenges the very fabric of understanding.

    This tome is not merely a book, but a vessel of forbidden knowledge and cosmic truth, a gateway to the emptiness between realities. It bestows upon its reader a profound, albeit perilous, understanding of the universe's most fundamental mysteries and the vast, cold expanse beyond existence. Reading it is said to risk one's sanity, yet promises unparalleled insight into the origins of magic and the nature of nothingness. The Tome compels a re-evaluation of all known truths, granting power to those brave (or foolish) enough to peer into the unfathomable depths of the void..`
  },
  {
    id: "the-hairpin-of-lunar-whisper",
    name: "The Haripin Of Lunar Whisper",
    price: 4999,
    badge: "UP TO 50% OFF",
    image: "/images/the-hairpin-of-lunar-whisper.png",
    category: "headgear",
    descShort: "Starlight silver crescent with a glowing Moonstone — nocturnal elegance.",
    descLong: `The Hairpin of Lunar Whisper is an exquisite piece of adornment, forged from purest starlight silver and meticulously sculpted into the delicate curve of a crescent moon, adorned with intricate, flowing filigree that mimics the gentle current of night winds. Set within the heart of the crescent is a large, ethereal Moonstone Cabochon, which glows with a soft, shifting luminescence, seemingly breathing with the phases of the moon itself. Tiny, dewdrop diamonds are scattered along the silver curves, glistening like captured starlight, while the pin itself is a slender, polished shaft designed to secure the most regal of coiffures.

    This hairpin is far more than a decorative item; it is a conduit to the subtle wisdom and hidden influences of the night sky. It bestows upon its wearer an aura of mysterious allure and quiet perceptiveness, enhancing intuition and making their counsel sought after in matters of subtle diplomacy or hidden truths. Legends say that when worn under a new moon, it allows the wearer to hear the 'whispers' of the celestial bodies, guiding their thoughts and revealing unspoken intentions. It is the perfect emblem for those who rule not with overt power, but with enigmatic grace and profound, lunar insight.`
  },
  {
    id: "the-crimson-claws-of-the-sanguine-knight",
    name: "The Crimson Claws of the Sanguine Knight",
    price: 8999,
    image: "/images/The Crimson Claws of the Sanguine Knight.png",
    category: "glove",
    descShort: "Blood-forged gauntlets with ruby talons — ferocious, honorable might.",
    descLong: `The Crimson Claws of the Sanguine Knight are a fearsome pair of articulated gauntlets forged from blood-tempered steel, their surface polished to a deep crimson sheen that seems to pulse with inner vitality. Each fingertip extends into razor-sharp talons crafted from enchanted rubies that never dull, capable of rending both armor and spirit. The knuckles are reinforced with intricate engravings depicting ancient battle oaths, and the palms bear the sigil of the Sanguine Order—a crimson rose pierced by a sword. The gauntlets emit a faint, warm glow, as if heated by the passion and fury of countless warriors who wore them before.

    These gauntlets are not tools of mindless violence, but symbols of a warrior's sacred commitment to honor, courage, and sacrifice. When worn, they heighten the wearer's combat instincts and channel their fighting spirit into precise, devastating strikes. The Crimson Claws grant their wielder unmatched ferocity tempered by unwavering discipline, ensuring that every blow is delivered with purpose and every battle fought with noble intent. They are the perfect armament for those who embrace the warrior's path with both passion and principle, transforming bloodshed into an art of righteous might.`
  },
  {
    id: "the-shadows-edge-of-the-silent-oath",
    name: "The Shadow's Edge of the Silent Oath",
    price: 9499,
    image: "/images/The Shadow's Edge of the Silent Oath.png",
    category: "sword",
    descShort: "Void-forged dagger of whispered promises — silent, absolute execution.",
    descLong: `The Shadow's Edge of the Silent Oath is a slender, elegant dagger forged from voidsteel—a metal born in absolute darkness and tempered in the silence between heartbeats. Its blade is impossibly thin yet unbreakable, with a surface so dark it seems to absorb light itself, creating an eerie void-like silhouette. The edge glimmers with a subtle violet hue, the only indication of its deadly sharpness. The hilt is wrapped in shadow-woven silk and capped with a pommel containing a single black pearl, said to hold the last breath of those who broke their sacred oaths.

    This dagger is the ultimate instrument of secrets and binding promises. It is wielded by those who operate in shadows, executing justice where light cannot reach. The Shadow's Edge makes no sound when drawn or when it strikes, and its victims fall without cry or struggle, as if claimed by sleep itself. Legend holds that the blade can sever not just flesh, but also lies and broken vows, making it the perfect tool for enforcers of sacred oaths. To carry this dagger is to accept the burden of absolute discretion and the weight of silent judgment.`
  },
  {
    id: "the-shattered-vows-of-the-fallen-paladin",
    name: "The Shattered Vows of the Fallen Paladin",
    price: 10999,
    image: "/images/The Shattered Vows of the Fallen Paladin.png",
    category: "sword",
    descShort: "Cracked holy blade bearing both divine light and corrupted shadow — redemption's edge.",
    descLong: `The Shattered Vows of the Fallen Paladin is a tragic yet powerful longsword, once a pristine holy blade now bearing visible cracks that run through its consecrated steel. These fissures glow with conflicting energies—golden divine light seeping from some, while others pulse with dark violet corruption. The crossguard, once shaped as angelic wings, is now twisted and broken, yet still radiates residual sanctity. The blade's surface is etched with shattered oath-runes that flicker between blessing and curse, and the pommel holds a fractured crystal that simultaneously emanates warmth and cold.

    This weapon embodies the eternal struggle between fall and redemption, sin and salvation. It grants its wielder tremendous power drawn from both holy righteousness and corrupted desperation, making each strike devastatingly effective against both celestial and infernal foes. The Shattered Vows resonates with those who have known failure, betrayal, or loss, amplifying their desire for atonement while feeding on their guilt. It is said that only through true redemption can the blade be fully restored—or through complete surrender to darkness, transforming it into a weapon of absolute corruption. It is a sword of second chances and terrible consequences.`
  },
  {
    id: "the-sunsteel-blade-of-the-dawnbreaker",
    name: "The Sunsteel Blade of the Dawnbreaker",
    price: 11499,
    image: "/images/The Sunsteel Blade of the Dawnbreaker.png",
    category: "sword",
    descShort: "Solar-forged greatsword radiating eternal dawn — banisher of all darkness.",
    descLong: `The Sunsteel Blade of the Dawnbreaker is a magnificent greatsword forged in the heart of a captured star, its blade crafted from pure sunsteel that radiates constant, gentle warmth. The metal gleams with an inner golden light that never fades, even in the deepest darkness, and its surface is etched with solar script that tells the story of the first sunrise. The crossguard is shaped like spreading sunbeams, cast from polished brass and inlaid with amber gems that pulse like a beating sun. The grip is wrapped in golden thread over phoenix feather, and the pommel contains a fragment of solidified sunlight.

    This blade is the ultimate weapon against darkness in all its forms—both physical shadow and spiritual corruption. When drawn, it bathes the surrounding area in warm, comforting light that dispels fear and despair while weakening creatures of darkness. Each strike burns with solar fire, cauterizing wounds and purifying corruption. The Dawnbreaker grants its wielder immunity to shadow magic and the ability to inspire hope in allies while instilling terror in those who serve darkness. It is said that this sword was forged to ensure that no matter how long the night, dawn will always come. It is the perfect weapon for champions of light and hope.`
  },
  {
    id: "the-whisperwind-rapier-of-the-sky-dancer",
    name: "The Whisperwind Rapier of the Sky Dancer",
    price: 7499,
    image: "/images/The Whisperwind Rapier of the Sky Dancer.png",
    category: "sword",
    descShort: "Air-blessed rapier of weightless grace — strikes with wind's invisible swiftness.",
    descLong: `The Whisperwind Rapier of the Sky Dancer is an impossibly slender blade forged from aerithium, a mystical metal lighter than air itself. The rapier's blade is nearly transparent, visible only by the faint shimmer of refracted light dancing along its length. Delicate wind-runes spiral along the fuller, and the tip seems to phase in and out of visibility as if existing partially in another dimension. The swept hilt is crafted from polished silver shaped like flowing clouds, and the grip is wrapped in woven phoenix down. The pommel contains a sky sapphire that swirls with miniature storm clouds.

    This rapier is the perfect fusion of elegance and lethal precision, granting its wielder supernatural speed and grace. When wielded, the blade moves with such swiftness that it seems to strike from multiple directions simultaneously, leaving only whispers of displaced air in its wake. The Whisperwind allows its bearer to move as if weightless, leaping impossible distances and landing without sound. Its strikes are so precise and quick that opponents often don't realize they've been hit until moments later. This is the ultimate weapon for duelists and assassins who value finesse over force, turning combat into a deadly dance of impossible beauty.`
  },
];

const products = baseProducts.map((product) => {
  if (typeof product.price === 'number') {
    const currency = product.currency || 'USD';
    return {
      ...product,
      currency,
      priceDisplay: formatCurrency(product.price, { currency })
    };
  }

  return {
    ...product,
    currency: product.currency || 'USD'
  };
});

export default products;
