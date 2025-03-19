"use client"
import {zodResolver} from "@hookform/resolvers/zod"
import {SubmitHandler, useForm} from "react-hook-form"
import {z} from "zod"
import {Button} from "@/components/ui/button"
import {Form, FormControl, FormField, FormItem, FormMessage,} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea"
import {ReactElement} from "react"
import axios from "axios";
import * as React from "react";

const formSchema = z.object({
    firstname: z.string().min(2, { message: "Please enter your first name" }),
    lastname: z.string().min(2, { message: "Please enter your last name" }),
    email: z.string().min(2, { message: "Please enter a valid email address in this format: yourname@example.com" }).email(),
    phone: z.string().max(20).optional(),
    message: z.string().min(5, { message: "Please enter your message" }),
});

// Infer the type of formSchema
type FormSchema = z.infer<typeof formSchema>;

export const submitHubspotForm = async (firstname: string, lastname: string, email: string, phone: string | undefined, message: string) => {
    const portalId: string = "47738603!";
    const formGuid: string = "0a95d186-f20f-4d44-bacd-5251d9f6b993!";
    const config = {
        headers: {
            "Content-Type": "application/json",
        }
    }

    return await axios.post(`https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formGuid}`,
        {
            portalId,
            formGuid,
            fields: [
                {
                    name: "firstname",
                    value: firstname,
                },
                {
                    name: "lastname",
                    value: lastname,
                },
                {
                    name: "email",
                    value: email,
                },
                {
                    name: "phone",
                    value: phone,
                },
                {
                    name: "message",
                    value: message,
                },
            ],
        },
        config
    );
}

export default function ContactForm(): ReactElement {
    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstname: "",
            lastname: "",
            email: "",
            phone: "",
            message: ""
        },
    });

    const formState: { errors: any, isSubmitting: any } = form.formState;
    const { errors } = formState;
    const [success, setSuccess] = React.useState(false);
    const [failure, setFailure] = React.useState(false);

    const onSubmit: SubmitHandler<FormSchema> = (values): void => {
        submitHubspotForm(values.firstname, values.lastname, values.email, values.phone, values.message)
            .then(response => {
                if (response.status >= 400) {
                    const message = `HTTP status code: ${response.status}`;
                    const err = new Error(message);
                    console.warn(response)
                    throw err;
                } else {
                    return response;
                }
            })
            .then(results => handleSuccess(results))
            .catch(error => handleError(error));
    }

    const handleSuccess = (result: any) => {
        if (!result) {
            return null;
        }

        if ((result.errors && result.message) || !result.data) {
            const message = result.message ? result.message : 'No data returned from API';
            handleError(new Error(message));
            return;
        }

        setSuccess(true);
    };

    const handleError = (error: Error) => {
        console.warn(error);

        setFailure(true);
    };

    const formHasErrors: boolean = errors && Object.keys(errors).length > 0;

    const resetForm = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
        e.preventDefault();
        setFailure(false);
        setSuccess(false);
        form.reset();
    }

    return (
        <div className="contact-form">
            <h3 className="small-caps-menu-button-lists">General Inquiries</h3>

            {failure && <div className="failure-message">
                <span className="text-destructive">Oops, something went wrong... Please <a href="#"
                                                                                           className="underline"
                                                                                           onClick={resetForm}>try again.</a></span>
            </div>}
            {success && <div className="success-message">
                <div className="h3-headings-and-pullquotes">Thank you</div>
                <p>Your submission has been sent and we’ll reply to you soon.</p>
                <button onClick={resetForm} className="button border p-3 border-black">Dismiss this message</button>
            </div>}

            {!failure && !success && <Form {...form}>
                {errors && Object.keys(errors).length > 0 && (<div className="error-message">
                    There are items that require your attention
                </div>)}
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="firstname"
                        render={({ field }): ReactElement => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="First Name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="lastname"
                        render={({ field }): ReactElement => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="Last Name" {...field} />
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
            </Form>}
        </div>
    )
}
