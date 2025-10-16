"use server"

import { comprasApi, ingredientesApi, categoriasApi, recetasApi } from "@/lib/api"
import type { Categoria, Compra, DashboardStats, Ingrediente, Receta } from "@/lib/types"

interface DashboardData {
  stats: DashboardStats
  recentRecipes: Receta[]
}

interface ShoppingPageData {
  items: Compra[]
  ingredients: Ingrediente[]
}

interface RecipesPageData {
  recipes: Receta[]
  categories: Categoria[]
}

interface IngredientsAndCategories {
  ingredients: Ingrediente[]
  categories: Categoria[]
}

export async function getDashboardData(): Promise<DashboardData> {
  const [recipes, ingredients, compras] = await Promise.all([
    recetasApi.getAll(),
    ingredientesApi.getAll(),
    comprasApi.getAll(),
  ])

  const recipesCompleted = recipes.filter(
    (recipe) => recipe.porcentajeCompletitud === 100 || recipe.completa,
  ).length

  const stats: DashboardStats = {
    totalRecetas: recipes.length,
    totalIngredientes: ingredients.length,
    recetasCompletas: recipesCompleted,
    comprasRegistradas: compras.length,
  }

  return {
    stats,
    recentRecipes: recipes,
  }
}

export async function getShoppingPageData(): Promise<ShoppingPageData> {
  const [items, ingredients] = await Promise.all([
    comprasApi.getAll(),
    ingredientesApi.getAll(),
  ])

  return { items, ingredients }
}

export async function getIngredientsPageData(): Promise<Ingrediente[]> {
  return ingredientesApi.getAll()
}

export async function getCategoriesPageData(): Promise<Categoria[]> {
  return categoriasApi.getAll()
}

export async function getRecipesPageData(): Promise<RecipesPageData> {
  const [recipes, categories] = await Promise.all([recetasApi.getAll(), categoriasApi.getAll()])
  return { recipes, categories }
}

export async function getRecipeFormData(): Promise<IngredientsAndCategories> {
  return getIngredientsAndCategories()
}

export async function getCookingHelperData(): Promise<IngredientsAndCategories> {
  return getIngredientsAndCategories()
}

async function getIngredientsAndCategories(): Promise<IngredientsAndCategories> {
  const [ingredients, categories] = await Promise.all([ingredientesApi.getAll(), categoriasApi.getAll()])
  return { ingredients, categories }
}
