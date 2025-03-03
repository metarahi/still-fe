"use client";
import Image from "next/image";
import Plus from "@/public/plus.svg";
import React, {ReactElement, useState} from "react";
import Link from "next/link";
import {Category} from "@/lib/wordpress.d";

interface Props {
    categories: Array<Category>
}

const ArticleCategories: React.FC<Props> = ({categories}: Props): ReactElement<any, any> => {
    const [showArticleCategories, setShowArticleCategories] = useState(false);

    function handleToggleCategories(): void {
        setShowArticleCategories(!showArticleCategories);
    }

    return (
        <div className="article-categories flex flex-col">
            <div className="small-caps-menu-button-lists w-full">
                <span className="max-md:hidden">Categories:</span>
                <span className="md:hidden flex justify-between w-full">Categories
                    <Image src={Plus} alt="Categories"
                           height="11"
                           width="11"
                           onClick={() => handleToggleCategories()}
                    /></span>
            </div>
            {categories.map((category: Category): ReactElement<any, any> => (
                <Link key={category.id} href={`?category=${category.id.toString()}`}
                      className={"border-radius" + (showArticleCategories ? "" : " max-md:hidden")}>
                    {category.name}
                </Link>
            ))}
        </div>
    )
}

export default ArticleCategories
