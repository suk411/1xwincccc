import { useState } from "react";
import { GameTabs, GameTab } from "@/components/GameTabs";
import fishIconImg from "@/assets/tabs/fish-icon.png";
import liveIconImg from "@/assets/tabs/live-icon.png";

const allIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAAAJFBMVEVMaXH/mpz/7+//mZr/m53/vsD/m5v/mZv/mp3/mpv/mp7/mpwSh04nAAAAC3RSTlMA8w8g7wkvmee2Lt92b/sAAAAJcEhZcwAAFiUAABYlAUlSJPAAAACSSURBVHic7ZNLDsMgDAX9BRvuf98qMe0iWClVo3aTWT2JERY2Brj5G0obeogzWk1ErDIAj6iJBlqx77iqR8LUJIvTjswyolEmPk+xlXF3l3OxXCXaLFomap3FmvaHXXDDWrE9oHPmASgH+grwncgeBa21KC156eXH0Gp76PrJyKcjFOY3I8S1jwurqwDLy3XzCx5I6QxBI9i78QAAAABJRU5ErkJggg==";
const recentIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAAAJ1BMVEVMaXH/mpz/mpz/mJv/mpz/mpz/mp3/mpz/mpz/mpz/mpz/mpv/mpzz6uhFAAAADXRSTlMA/u8JErsl92/YoT5Z594S5QAAAAlwSFlzAAAWJQAAFiUBSVIk8AAAAPhJREFUeJztlNsSgzAIRGGBXEz//3s7wVhNNNa+lyfHOQF2ISH6xy8hoqoi8g0LyTKQLYVbNCyI7BGxhHm6FxwBHMdrklQSmKOloBqSgRnpmqz5cmkypOSa87I/MJs65KwaMy76lIU5r5zZSmaOy7l4AKP4lwJ+gEq8SCkp8ppoB8U4nvT4T+pA0XpYB1Lzp0wDZTUfQ5sKbgUdVBWXvRkxARmACYXMnEc1h9JidYhVWUEzYhCzzaEummuQdB7iwZ7jX6Ebw3dMR2/6Ee5tY/RmS9l5oZOl6NdMbtaMfHGxLW6cL+7jq0CPLxc9v67UHgD9+gD8g7p4AxDRBjLhTZjIAAAAAElFTkSuQmCC";
const slotsIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAAAVFBMVEVMaXH/v8H/paj/mpz/mpz/oaL/mZv/2Nj/4OD/nJ7/m53/nJ//nJ7/mJr/mZv/nJ7/mJn/mpz/mJv/mZv/mpz/2tv/v8H/3d3/wcH/nJ3/mpz/kpS8Eg0AAAAAGnRSTlMACRJ60RorAT/r32fxwpGjTj2ziPkmnDJ2WM4z0lUAAAAJcEhZcwAAFiUAABYlAUlSJPAAAAEySURBVHic7VLJdsMgDBSrzG7AziL//3/2gdM2Nu3LNYfMRUgM0kgI4IP3B74MPIB8ujI1TdPKmsPhX2RrY7LGhujuooiR+V1i3p4R1PG2n5ViXLPZ0C+8UBwB2UEo3kJMMgr7RIxKFJddnA7Ey0ZEskoib5bOszob8nbZbiMxOEnS3UUKhiip2B+E9UxcKDhLrg1GeFqclo1n5mPbl026Wl0pGQB0ILKzEkUSFXUmCgQlUs0IujS9GbAVr8ffQVc1wGwXOQPr2mQGyJK8Ow0cscfJZNiHGXRXcJLYwVNLpFkzRIVjbUP6g9gzBbU3S4lp+1BwAoo26MLvfv8XdM0Peqxc2iIULvaNiKw2IwciquSN8VEJb4wxvvLa/DJmZNepr+zazM/hyoaMY3cvLj54E3wBI74aJMem6K4AAAAASUVORK5CYII=";
const casinoIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAAAM1BMVEVMaXH/mpz/mpz/mpz/lpf/mpz/m53/mpz/mpz/mpz/mpz/mpz/m5z/mpz/mpz/mpz/mpyGOzAvAAAAEHRSTlMAlWkkCYVEecXbpPBZFTOzfZl1SgAAAAlwSFlzAAAWJQAAFiUBSVIk8AAAAWJJREFUeJztVFty4zAMEynxrQfvf9oOnXRnmzrtBQr9eGxYJABKrf2hMB64nt9j7Eng7iCz/8Rbk+hkwYnm+107wewzMtO4I8h6y5Pd2rbM1NUa0xvmcu2tdTx61KtFVbitLhnYWUSISES4U8a84VXJOCKuZqYgpJFZNV4w4BKLJ1KPZbhovZDbDVPxZPoerJmAn6q+Yh6NIIpHX5IZAml6+FWyYJerXNQnzMxDPrvgi/BF3DpCpNFurTFYGuFqU+6JGc/ghkTAT8Tz2Xy3gHlHlDkmkJVxY43W2JSAB772ONBdTSBhb651ygIF51sfHTVN5xK1PFiOf49m1RwGiF3xlPdeydD3sbjmUIUqarMj9UtaeXUTNjCSEDiQyGS/i7oMUe1tsLiDA+4S/s+sr+ByuLFlXBq6wE3hJ5N48DU0fTBcYd5jCz3EBiHhTwd2MD4nHPcvd8DaPCdz/+2q+EP7Hx9U6xG6PTge3wAAAABJRU5ErkJggg==";
const fishIcon = fishIconImg;
const liveIcon = liveIconImg;
const sportIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAAAMFBMVEVMaXH/mJn/mpv/mpz/mpz/mpz/mpz/mpz/mpz/mpz/mpz/mpz/mZz/mpz/m5v/mpwSYrVHAAAAD3RSTlMACQ/1syHHeJ6M6jVk2ksRWTxTAAAACXBIWXMAABYlAAAWJQFJUiTwAAABTUlEQVR4nO1Uy5LkIAxDfmEMxP//t1uQzkxVJ72zex+fEkdItoVTym/8TwAgAvATTKuLiEvr9DccubUYqn00E/2MO6YQWccqgFqMT/qDB3pkNF1FKnN9RvapqJyZHOLulsnjsb6Y1RYuk2vvqpYZ/aHfxrXGxuXcHWtk2l2cuALHZnwponLyjRKDqRSamczxGiGEWd4pyVYKEuLVXnMhOcZ16BsoxyrLdA9mC6Ia4c64jID7yuPkIRsFt1GuXgrZWTtc+jGa0BMwhKhuwv3GvBtBewdC2I2v9DmmSYXkvRkM5i8nyE6DtBx2u216kQDol5Pwm3SB728+avMTlyweD5dyWZvJrbU65nqMg+JOWMo2mtveF3JOU7R7hRtZOS8pEiN6FD6Rwe3kICG1+XFr0IWtA9rNqr3OPAcdZi4zQpr+sNogEK1fQPmN8u/xBwzhDELymY7eAAAAAElFTkSuQmCC";

const IconImg = ({ src, alt }: { src: string; alt: string }) => (
  <img src={src} alt={alt} className="w-5 h-5 object-contain" />
);

const gameTabs: GameTab[] = [
  { label: "TOP", value: "top" },
  { label: "All", value: "all", icon: <IconImg src={allIcon} alt="All" /> },
  { label: "Recent", value: "recent", icon: <IconImg src={recentIcon} alt="Recent" /> },
  { label: "Slots", value: "slots", icon: <IconImg src={slotsIcon} alt="Slots" /> },
  { label: "Casino", value: "casino", icon: <IconImg src={casinoIcon} alt="Casino" /> },
  { label: "FISH", value: "fish", icon: <IconImg src={fishIcon} alt="Fish" /> },
  { label: "LIVE", value: "live", icon: <IconImg src={liveIcon} alt="Live" /> },
  { label: "SPORT", value: "sport", icon: <IconImg src={sportIcon} alt="Sport" /> },
];

const HomeGameTabs = () => {
  const [activeTab, setActiveTab] = useState("top");

  return (
    <div className="mt-2 rounded-lg overflow-hidden">
      <GameTabs
        tabs={gameTabs}
        value={activeTab}
        onChange={setActiveTab}
        className="rounded-lg"
      />
    </div>
  );
};

export default HomeGameTabs;
