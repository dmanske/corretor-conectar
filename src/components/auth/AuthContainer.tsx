
import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AuthContainerProps {
  children: ReactNode;
  title: string;
  description: string;
  footer?: ReactNode;
  defaultTab?: string;
  showTabs?: boolean;
}

const AuthContainer = ({ 
  children, 
  title, 
  description, 
  footer,
  defaultTab = "login",
  showTabs = true
}: AuthContainerProps) => {
  return (
    <div className={`flex items-center justify-center ${showTabs ? 'px-4' : ''}`}>
      <Card className={`w-full ${showTabs ? 'max-w-md' : ''} shadow-xl`}>
        {(title || description) && (
          <CardHeader className="space-y-1">
            {title && <CardTitle className="text-2xl font-bold text-center">{title}</CardTitle>}
            {description && <CardDescription className="text-center">{description}</CardDescription>}
          </CardHeader>
        )}
        
        {showTabs ? (
          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="register">Cadastrar</TabsTrigger>
            </TabsList>
            {children}
          </Tabs>
        ) : (
          <CardContent className={title || description ? '' : 'pt-0'}>
            {children}
          </CardContent>
        )}
        
        {footer && <CardFooter>{footer}</CardFooter>}
      </Card>
    </div>
  );
};

export default AuthContainer;
