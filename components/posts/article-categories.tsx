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
        <div className={"article-categories flex flex-col" + (showArticleCategories ? " toggle-open" : " toggle-closed")} data-aos="fade-up">
            <div className="small-caps-menu-button-lists w-full">
                <span className="max-xl:hidden">Categories:</span>
                <span className="xl:hidden flex justify-between w-full"
                      onClick={() => handleToggleCategories()}
                >Categories
                    <Image src={Plus} alt="Categories"
                           height="11"
                           width="11"
                    /></span>
            </div>
            {categories.map((category: Category): ReactElement<any, any> => (
                <Link key={category.id} href={`/category/${category.slug}`}
                      className={"border-radius" + (showArticleCategories ? "" : " max-xl:hidden")}>
                    {category.name}
                </Link>
            ))}
        </div>
    )
}

export default ArticleCategories
