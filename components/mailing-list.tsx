"use client"
import {zodResolver} from "@hookform/resolvers/zod"
import {SubmitHandler, useForm} from "react-hook-form"
import {z} from "zod"
import {Form, FormControl, FormField, FormItem, FormMessage,} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {ReactElement} from "react"
import axios from "axios";
import * as React from "react";
import Link from "next/link";
import {Button} from "@/components/ui/button";

const formSchema = z.object({
    email: z.string().min(2, { message: "Please enter a valid email address in this format: yourname@example.com" }).email(),
});

// Infer the type of formSchema
type FormSchema = z.infer<typeof formSchema>;

export const submitHubspotForm = async (email: string) => {
    const portalId: string = "47738603";
    const formGuid: string = "d47b0539-2daf-4018-a799-a75133d31127";
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
                    name: "email",
                    value: email,
                },
            ],
        },
        config
    );
}

export default function MailingList(): ReactElement {
    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    });

    const formState: { errors: any, isSubmitting: any } = form.formState;
    const { errors } = formState;
    const [success, setSuccess] = React.useState(false);
    const [failure, setFailure] = React.useState(false);

    const onSubmit: SubmitHandler<FormSchema> = (values): void => {
        submitHubspotForm(values.email)
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

    const handleSuccess = (result) => {
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

    const resetForm = (e) => {
        e.preventDefault();
        setFailure(false);
        setSuccess(false);
        form.reset();
    }

    return (
        <div>
            {failure && <div className="failure-message">
                <span className="text-destructive">Oops, something went wrong... Please <a href="#"
                                                                                           className="underline"
                                                                                           onClick={resetForm}>try again.</a></span>
            </div>}
            {success && <div className="success-message">
                <div className="h3-headings-and-pullquotes">Thank you for signing up.</div>
                <p>We’ll keep you posted on the latest STILL news and updates.</p>
                <button onClick={resetForm} className="button border p-3 border-black">Dismiss this message</button>
            </div>}
            {!failure && !success && <Form {...form}>
                {formHasErrors && (<div className="error-message">
                    There are items that require your attention
                </div>)}
                <p>Sign up to our mailing list</p>
                <form onSubmit={form.handleSubmit(onSubmit)} className={formHasErrors ? 'has-errors mailing-list-form' : 'mailing-list-form'}>
                    <FormField
                        control={form.control}
                        name="email"
                        render={({field}): ReactElement => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="Enter email" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <button type="submit" className="button border p-3 border-black">Submit</button>
                </form>
            </Form>}
        </div>
    )
}
