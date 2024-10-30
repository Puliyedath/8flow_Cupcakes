import { ICupcake, ICupcakeId } from '@/models/Cupcake';
export type Json = boolean | number | string | null | { [key: string]: Json } | Array<Json>;
export type CupCakeWithId = ICupcake & ICupcakeId
