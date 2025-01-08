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
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Popular Categories</h2>
      <div className="grid  p-6  grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 lg:gap-6">
        {categoryList.map((category, index) => (
          <div key={index} className="bg-white flex flex-col items-center justify-center text-center p-4 rounded-lg shadow-sm transition-transform transform hover:scale-105 hover:shadow-lg">
            <img className="w-20 h-20 lg:w-24 lg:h-24  object-contain mb-3" src={category.img} alt={category.name} />
            <p className="text-gray-700 text-sm md:text-base font-medium">{category.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryCard;
