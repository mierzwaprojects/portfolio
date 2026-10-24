import DOMPurify from "dompurify";
import { PageSkeleton } from "@/components/PageSkeleton";
import { useRoute } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowLeft, ArrowRight, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useI18n } from "@/i18n/context/I18nContext";
import { useTranslation } from "@/i18n/hooks/useTranslation";
import { useBlogPost } from "@/hooks/useBlog";
import { blogRepository, homeRepository, portfolioRepository } from "@/repositories/instances";
import { useHome } from "@/hooks/useHome";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useContactWizard } from "@/contexts/ContactWizardContext";
import { findRelatedCase } from "@/utils/relatedCase";

export default function BlogPost() {
    const { t } = useTranslation();
    const { isLoading: i18nLoading } = useI18n();
    const [match, params] = useRoute("/blog/:slug");
    const slug = params?.slug || '';
    const { post, isLoading } = useBlogPost(blogRepository, slug);
    const { contactRole, contactWizardEnabled } = useHome(homeRepository);
    const { projects } = usePortfolio(portfolioRepository);
    const { openWizard } = useContactWizard();

    if (isLoading || i18nLoading) {
        return <PageSkeleton />;
    }

    if (!post) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                    <h1 className="text-3xl font-bold text-white">{t('blog.postNotFound')}</h1>
                    <p className="text-gray-400">{t('blog.postNotFoundDescription')}</p>
                    <Link href="/blog">
                        <Button variant="outline" className="mt-4">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            {t('blog.backToBlog')}
                        </Button>
                    </Link>
            </div>
        );
    }

    return (
            <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto space-y-8 pb-12"
            >
                <Link href="/blog">
                    <Button variant="ghost" className="text-gray-400 hover:text-white -ml-4">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {t('blog.backToBlog')}
                    </Button>
                </Link>

                <header className="space-y-6">
                    <div className="flex flex-wrap gap-2">
                        {post.tags?.map((tag: string) => (
                            <Badge key={tag} className="bg-neon-purple/10 text-neon-purple hover:bg-neon-purple/20 border-neon-purple/20">
                                {tag}
                            </Badge>
                        ))}
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                        {post.title}
                    </h1>

                    {post.subtitle && (
                        <p className="text-xl text-gray-300 leading-relaxed">
                            {post.subtitle}
                        </p>
                    )}

                    <div className="flex items-center gap-6 text-gray-400 text-sm border-b border-white/10 pb-8">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(post.published_at).toLocaleDateString('pt-BR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            })}</span>
                        </div>
                        {/* Read time could be calculated based on word count */}
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{Math.ceil(post.content.split(' ').length / 200)} {t('blog.readTime')}</span>
                        </div>
                    </div>
                </header>

                {post.image && (
                    <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10">
                        <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                <div
                    className="blog-content"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
                />

                <PostFooter
                    role={contactRole}
                    related={findRelatedCase(post.tags, projects)}
                    showContact={contactWizardEnabled}
                    onContact={() => openWizard({ sourceContext: `blog-${slug}` })}
                    t={t}
                />
            </motion.article>
    );
}

interface PostFooterProps {
    role: string;
    related?: { slug?: string; title: string; description: string };
    showContact: boolean;
    onContact: () => void;
    t: (key: string) => string;
}

/** Fim do post: quem escreveu, como falar comigo e o case que mostra isso na prática. */
function PostFooter({ role, related, showContact, onContact, t }: PostFooterProps) {
    return (
        <footer className="space-y-4 border-t border-white/10 pt-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-5 rounded-xl border border-white/10 bg-card/50 p-6">
                <img src="/brand/mm-symbol-purple.svg" alt="" className="h-12 w-12 shrink-0" />
                <div className="flex-1">
                    <p className="font-bold text-white">Matheus Mierzwa</p>
                    {role && <p className="text-sm text-neon-lime">{role}</p>}
                    <p className="text-sm text-gray-400 mt-1">{t('blog.authorLine')}</p>
                </div>
                {showContact && (
                    <button
                        onClick={onContact}
                        data-umami-event="blog-cta-contato"
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-neon-purple text-black font-semibold hover:bg-neon-purple/90 transition-colors"
                    >
                        <MessageSquare className="w-4 h-4" />
                        {t('blog.authorCta')}
                    </button>
                )}
            </div>

            {related?.slug && (
                <Link
                    href={`/portfolio/${related.slug}`}
                    data-umami-event="blog-case-relacionado"
                    className="group block rounded-xl border border-white/5 bg-gradient-to-br from-[#1e1e1e] to-[#121212] p-6 hover:border-neon-purple/40 transition-colors"
                >
                    <p className="text-xs font-mono uppercase tracking-wider text-neon-purple">{t('blog.relatedCase')}</p>
                    <p className="mt-2 text-lg font-bold text-white">{related.title}</p>
                    <p className="mt-1 text-sm text-gray-400 line-clamp-2">{related.description}</p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-mono text-neon-lime">
                        {t('blog.readCase')}
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                </Link>
            )}
        </footer>
    );
}
