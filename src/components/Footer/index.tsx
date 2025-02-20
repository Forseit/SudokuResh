
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface FooterProps {
  t: {
    users: string;
    gamesSolved: string;
    updatesReleased: string;
    daysFromStart: string;
    reviews: string;
    navigation: string;
  };
}

const Footer = ({ t }: FooterProps) => {
  const { data: stats } = useQuery({
    queryKey: ["global_stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("global_stats")
        .select("*")
        .single();

      if (error) throw error;
      return data;
    },
  });

  const calculateDaysFromStart = () => {
    if (!stats?.start_date) return 0;
    const startDate = new Date(stats.start_date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <footer className="mt-8 border-t">
      <div className="container px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">{t.navigation}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/reviews"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t.reviews}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-2xl font-bold">{stats?.user_count || 0}</div>
                <div className="text-sm text-muted-foreground">{t.users}</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {stats?.games_solved || 0}
                </div>
                <div className="text-sm text-muted-foreground">
                  {t.gamesSolved}
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {stats?.updates_count || 0}
                </div>
                <div className="text-sm text-muted-foreground">
                  {t.updatesReleased}
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {calculateDaysFromStart()}
                </div>
                <div className="text-sm text-muted-foreground">
                  {t.daysFromStart}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
