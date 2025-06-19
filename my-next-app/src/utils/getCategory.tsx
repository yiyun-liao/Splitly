
const CLOUDINARY_BASE = "https://res.cloudinary.com/ddkkhfzuk/image/upload";
const CATEGORY_FOLDER = "cat";


// 組合 Cloudinary 頭貼網址
export function buildCatUrl(name: string): string {
  const sanitizedName = name.replace(/[\\\/\?\&#%<> ]/g, '');
  return `${CLOUDINARY_BASE}/${CATEGORY_FOLDER}/${sanitizedName}.jpg` || "";
}

import {
    ForkKnifeIcon, BreadIcon, HamburgerIcon, PizzaIcon, CheeseIcon, CoffeeIcon, WineIcon, CarrotIcon,
    StorefrontIcon, SneakerIcon, ToteIcon, TShirtIcon, BaseballCapIcon,MagicWandIcon , GiftIcon, LaptopIcon, SketchLogoIcon,
    VanIcon, BuildingIcon, CarProfileIcon, GasPumpIcon, LetterCirclePIcon, TrainIcon, AirplaneTiltIcon, SailboatIcon, TaxiIcon, ShieldCheckIcon,
    HouseLineIcon, CouchIcon, LightbulbIcon, DropIcon, LightningIcon, FireSimpleIcon, WrenchIcon, WashingMachineIcon, PhoneDisconnectIcon, BroomIcon, GlobeIcon, BrowsersIcon, InvoiceIcon,
    MusicNotesIcon, MicrophoneStageIcon, GameControllerIcon, HairDryerIcon, CastleTurretIcon, BeachBallIcon, ConfettiIcon, FilmSlateIcon, PaletteIcon, PersonIcon,
    DotsThreeCircleIcon
} from "@phosphor-icons/react";

export const categoryIconMap: Record<string, React.FC<import("@phosphor-icons/react").IconProps>> = {
    "Food & Drink": ForkKnifeIcon,
    Breakfast: BreadIcon,
    Lunch: HamburgerIcon,
    Dinner: PizzaIcon,
    Snacks: CheeseIcon,
    Groceries: CarrotIcon,
    Drinks: CoffeeIcon,
    Alcohol: WineIcon,

    Shopping: StorefrontIcon,
    Clothing: TShirtIcon,
    Shoes: SneakerIcon,
    Accessories: BaseballCapIcon,
    Bags: ToteIcon,
    Beauty: MagicWandIcon,
    Luxury: SketchLogoIcon,
    Gifts: GiftIcon,
    Electronics: LaptopIcon,

    "Transport & Stay": VanIcon,
    Hotel: BuildingIcon,
    Gas: GasPumpIcon,
    Parking: LetterCirclePIcon,
    Rental: CarProfileIcon,
    Train: TrainIcon,
    Taxi: TaxiIcon,
    Flight: AirplaneTiltIcon,
    Boat: SailboatIcon,
    Insurance: ShieldCheckIcon,

    Home:HouseLineIcon,
    Furniture: CouchIcon,
    Supplies: LightbulbIcon,
    Electricity: LightningIcon,
    Water: DropIcon,
    Gas: FireSimpleIcon,
    Rent: BrowsersIcon,
    Laundry:WashingMachineIcon ,
    Repair: WrenchIcon,
    Subscription: InvoiceIcon,
    Internet: GlobeIcon,
    Phone: PhoneDisconnectIcon,
    Cleaning: BroomIcon,

    Entertainment:MicrophoneStageIcon,
    Games: GameControllerIcon,
    Salon: HairDryerIcon,
    "Theme Park": CastleTurretIcon,
    Exhibition: PaletteIcon,
    Movie: FilmSlateIcon,
    Music: MusicNotesIcon,
    Sports: BeachBallIcon,
    Party: ConfettiIcon,
    Massage: PersonIcon,

    Others: DotsThreeCircleIcon,
};