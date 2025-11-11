import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function GET(req: Request) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const categoryId = searchParams.get("categoryId")
    const published = searchParams.get("published")
    const search = searchParams.get("search")

    const where: any = {}

    if (categoryId) {
      where.categoryId = categoryId
    }

    if (published === "true") {
      where.published = true
    } else if (published === "false") {
      where.published = false
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ]
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ products })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()
    const {
      name,
      slug,
      description,
      price,
      stock,
      categoryId,
      images,
      published,
      metaTitle,
      metaDescription,
    } = body

    // Validation
    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Product name is required" },
        { status: 400 }
      )
    }

    if (!slug || slug.trim().length === 0) {
      return NextResponse.json(
        { error: "Product slug is required" },
        { status: 400 }
      )
    }

    if (price === undefined || price < 0) {
      return NextResponse.json(
        { error: "Valid price is required" },
        { status: 400 }
      )
    }

    if (stock === undefined || stock < 0) {
      return NextResponse.json(
        { error: "Valid stock is required" },
        { status: 400 }
      )
    }

    if (!categoryId) {
      return NextResponse.json(
        { error: "Category is required" },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    })

    if (existingProduct) {
      return NextResponse.json(
        { error: "A product with this slug already exists" },
        { status: 400 }
      )
    }

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    })

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 400 }
      )
    }

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        slug: slug.trim(),
        description: description?.trim() || null,
        price: parseFloat(price),
        stock: parseInt(stock),
        categoryId,
        images: images || [],
        published: published === true,
        metaTitle: metaTitle?.trim() || null,
        metaDescription: metaDescription?.trim() || null,
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json({
      success: true,
      product,
    })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
