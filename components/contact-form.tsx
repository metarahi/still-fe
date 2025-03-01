"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, SubmitHandler } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ReactElement } from "react"

const formSchema = z.object({
    name: z.string().min(2, { message: "Name is required" }),
    email: z.string().min(2, { message: "Email is required" }).email(),
    phone: z.string().max(15).optional(),
    message: z.string().min(10, { message: "Message is required" }),
})

// Infer the type of formSchema
type FormSchema = z.infer<typeof formSchema>

export default function ContactForm(): ReactElement {
    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            message: ""
        },
    })

    const onSubmit: SubmitHandler<FormSchema> = (values): void => {
        console.log(values)
    }

    return (
        <div className="contact-form">
            <h3 className="small-caps-menu-button-lists">General Inquiries</h3>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }): ReactElement => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="Name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }): ReactElement => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="Email Address" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }): ReactElement => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="Phone (optional)" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="message"
                        render={({ field }): ReactElement => (
                            <FormItem>
                                <FormControl>
                                    <Textarea placeholder="Add message..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" variant="button">Submit</Button>
                </form>
            </Form>
        </div>
    )
}
