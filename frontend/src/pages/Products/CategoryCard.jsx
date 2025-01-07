const CategoryCard = () => {
  const categoryList = [
    {
      name: "Furniture",
      img: "https://res.cloudinary.com/dzwqyiazp/image/upload/v1735749856/category-icons/hbunxbr25enk7n0h207j.png",
    },
    {
      name: "Phones",
      img: "https://res.cloudinary.com/dzwqyiazp/image/upload/v1735749855/category-icons/ujbl2hfdacyznxxqy1vm.png",
    },
    {
      name: "Electronics",
      img: "https://res.cloudinary.com/dzwqyiazp/image/upload/v1735749856/category-icons/e3m8mwrwglo4u6ttxkms.png",
    },
    {
      name: "Home & Appliances",
      img: "https://res.cloudinary.com/dzwqyiazp/image/upload/v1735749856/category-icons/eb3wn8jfaprnutdyq0iq.png",
    },
    {
      name: "Shoes",
      img: "https://res.cloudinary.com/dzwqyiazp/image/upload/v1735749856/category-icons/pvpyeddtnd44fko2xjop.png",
    },
    {
      name: "Clothes",
      img: "https://res.cloudinary.com/dzwqyiazp/image/upload/v1735750271/category-icons/esg9wgbhrqo2z4vugfbi.png",
    },
  ];

  return (
    <div className="mt-8 p-3  ">
      <div className="grid grid-cols-3 md:grid-cols-4 lg:flex gap-3">
        {categoryList.map((category, index) => (
          <div key={index} className="w-full flex bg-white  gap-2  flex-col justify-between items-center text-black p-6 rounded-lg shadow-md">
            <img className="lg:w-[60%] w-full" src={category.img} alt={category.name} />
            <p className="md:text-lg text-sm text-center font-medium">{category.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryCard;
