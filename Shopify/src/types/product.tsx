export interface Product{
  id:number,
    slug:string,
    title:string,
    description:string,
    price: number;
  category: CategoryObj;
  image: string;
  rating: number;
  stock: number;
  

}
export interface CategoryObj {
  id: number;
  name: string;
  slug: string;
}
