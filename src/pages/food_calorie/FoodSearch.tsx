import { useState, useEffect } from "react";
import { supabase } from "../../config/supabaseClient";
import { AppLayout } from "@/components/layout/AppLayout";

interface FoodItem {
  product_name: string;
  nutriments?: {
    "energy-kcal"?: number;
    proteins?: number;
    carbohydrates?: number;
    fat?: number;
  };
  image_url?: string;
  date?: string;
}

interface SavedFoodEntry {
  id: string;
  date: string;
  product_name: string;
  calories: number;
  proteins: number;
  carbohydrates: number;
  fats: number;
  image_url?: string;
  meal_type: string;
  serving_size: number;
}

const FoodSearch: React.FC = () => {
  const [foodName, setFoodName] = useState("");
  const [foodResults, setFoodResults] = useState<FoodItem[]>([]);
  const [selectedFoods, setSelectedFoods] = useState<FoodItem[]>([]);
  const [savedEntries, setSavedEntries] = useState<SavedFoodEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [mealType, setMealType] = useState<string>("snack");
  const [loading, setLoading] = useState(false);

  const resultsPerPage = 8;

  useEffect(() => {
    loadSavedEntries();
  }, []);

  const loadSavedEntries = async () => {
    try {
      const { data, error } = await supabase
        .from("food_entries")
        .select("*")
        .order("date", { ascending: false });

      if (error) throw error;
      setSavedEntries(data || []);
    } catch (err) {
      console.error("Error loading saved entries:", err);
      setError("Failed to load saved entries");
    }
  };

  const searchFood = async () => {
    if (!foodName.trim()) return;

    setLoading(true);
    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${foodName}&json=true`;
    try {
      const response = await fetch(url);
      const data = await response.json();

      const filteredResults = data.products.filter((product: FoodItem) => {
        return (
          product.nutriments &&
          (product.nutriments["energy-kcal"] !== undefined ||
            product.nutriments.proteins !== undefined ||
            product.nutriments.carbohydrates !== undefined ||
            product.nutriments.fat !== undefined) &&
          product.image_url
        );
      });

      const accessibleResults = await Promise.all(
        filteredResults.map(async (product: FoodItem) => {
          if (product.image_url) {
            const imageResponse = await fetch(product.image_url);
            if (imageResponse.ok) {
              return product;
            }
          }
          return null;
        })
      );

      const validResults = accessibleResults.filter(
        (product) => product !== null
      ) as FoodItem[];

      if (validResults.length > 0) {
        setFoodResults(validResults);
        setError(null);
        setCurrentPage(1);
      } else {
        setFoodResults([]);
        setError("No food found!");
      }
    } catch (err) {
      setError("Error fetching data!");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFood = async (food: FoodItem) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setError("Please log in to save food entries");
        return;
      }

      const entry = {
        user_id: user.id,
        date: new Date().toISOString().split("T")[0],
        product_name: food.product_name,
        calories: food.nutriments?.["energy-kcal"] || 0,
        proteins: food.nutriments?.proteins || 0,
        carbohydrates: food.nutriments?.carbohydrates || 0,
        fats: food.nutriments?.fat || 0,
        image_url: food.image_url,
        meal_type: mealType,
        serving_size: 1,
      };

      const { error: saveError } = await supabase
        .from("food_entries")
        .insert(entry);

      if (saveError) throw saveError;

      await loadSavedEntries();
      setSelectedFoods((prev) => [...prev, food]);
    } catch (err) {
      console.error("Error saving food entry:", err);
      setError("Failed to save food entry");
    }
  };

  const handleDeleteEntry = async (id: string) => {
    try {
      const { error } = await supabase
        .from("food_entries")
        .delete()
        .eq("id", id);

      if (error) throw error;
      await loadSavedEntries();
    } catch (err) {
      console.error("Error deleting entry:", err);
      setError("Failed to delete entry");
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const totalPages = Math.ceil(foodResults.length / resultsPerPage);
  const displayedResults = foodResults.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  const groupEntriesByDate = () => {
    const grouped: { [key: string]: SavedFoodEntry[] } = {};
    savedEntries.forEach((entry) => {
      if (!grouped[entry.date]) {
        grouped[entry.date] = [];
      }
      grouped[entry.date].push(entry);
    });
    return grouped;
  };

  return (
    <>
      <AppLayout>
        <div className="flex flex-col gap-8 items-center justify-start animate-fade-in w-full p-8">
          <div className="text-center">
            <h2 className="font-semibold leading-7 bg-gradient-to-r from-[#200f7b] to-[#961aae] text-transparent bg-clip-text">
              Food Nutrition Search
            </h2>
            <p className="mt-1 text-3xl font-bold tracking-tight">
              Track your Food Calories!
            </p>
          </div>
          <div className="flex flex-col items-center p-6 w-full bg-gradient-to-r from-[#2A1184] to-[#7417A2] min-h-screen">
            <div className="flex flex-wrap gap-4 justify-center mb-4 w-full max-w-full px-2">
              <input
                type="text"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                placeholder="Enter food name"
                className="border p-2 rounded shadow-md bg-white w-full md:w-80"
              />
              <select
                title="mealType"
                value={mealType}
                onChange={(e) => setMealType(e.target.value)}
                className="border p-2 rounded bg-white shadow-md w-full md:w-40"
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
              <button
                onClick={searchFood}
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-2 rounded shadow-md hover:bg-blue-600 disabled:bg-blue-300 w-full md:w-auto"
              >
                {loading ? "Searching..." : "Search"}
              </button>
            </div>

            {error && <p className="text-red-500">{error}</p>}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-screen-xl mt-4 px-2">
              {displayedResults.map((product, index) => (
                <div
                  key={index}
                  className="border p-4 rounded-lg shadow bg-white transform transition-all duration-200 hover:scale-105 cursor-pointer"
                  onClick={() => handleSelectFood(product)}
                >
                  <img
                    src={product.image_url}
                    alt={product.product_name}
                    className="w-full h-32 object-cover mb-2 rounded"
                  />
                  <strong>{product.product_name || "Unknown Name"}</strong>
                  <p>
                    Calories: {product.nutriments?.["energy-kcal"] ?? "N/A"}{" "}
                    kcal
                  </p>
                  <p>Proteins: {product.nutriments?.proteins ?? "N/A"} g</p>
                  <p>Carbs: {product.nutriments?.carbohydrates ?? "N/A"} g</p>
                  <p>Fats: {product.nutriments?.fat ?? "N/A"} g</p>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-6 flex gap-2 justify-center">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded shadow-md ${
                        page === currentPage
                          ? "bg-blue-600 text-white"
                          : "bg-gray-300 text-black"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>
            )}

            <div className="mt-8 w-full max-w-screen-xl">
              <h3 className="text-xl font-semibold mb-4 text-white">
                Food Diary
              </h3>
              {Object.entries(groupEntriesByDate()).map(([date, entries]) => (
                <div
                  key={date}
                  className="mb-6 bg-white rounded-lg shadow-md p-4"
                >
                  <h4 className="text-lg font-semibold mb-2">
                    {new Date(date).toLocaleDateString()}
                  </h4>
                  <div className="space-y-2">
                    {entries.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded"
                      >
                        <div className="flex items-center gap-4">
                          {entry.image_url && (
                            <img
                              src={entry.image_url}
                              alt={entry.product_name}
                              className="w-12 h-12 object-cover rounded"
                            />
                          )}
                          <div>
                            <p className="font-medium">{entry.product_name}</p>
                            <p className="text-sm text-gray-600">
                              {entry.meal_type} • {entry.calories} kcal
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteEntry(entry.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 pt-2 border-t">
                    <p className="font-medium">
                      Daily Totals:{" "}
                      {entries.reduce((sum, entry) => sum + entry.calories, 0)}{" "}
                      kcal
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AppLayout>
    </>
  );
};

export default FoodSearch;
