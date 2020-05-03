<?php


namespace App\Controller;


use App\Entity\User;
use App\Security\UserAuthenticator;
use App\Service\UserService;
use App\Utils\Response\MyJsonResponse;
use Doctrine\DBAL\Exception\UniqueConstraintViolationException;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Routing\Exception\MissingMandatoryParametersException;
use Symfony\Component\Security\Guard\GuardAuthenticatorHandler;

class SecurityController extends AbstractController
{
    private $em;

    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
    }

    /**
     * @Route("/login", name="user_login", methods={"POST"})
     * @param Request $request
     */
    public function login(Request $request) {

    }

    /**
     * @Route("/logout", methods={"POST"})
     */
    public function logout(){

    }

    /**
     * @Route("/register", methods={"POST"})
     * @param Request $request
     * @param UserService $userService
     * @param GuardAuthenticatorHandler $guardAuthenticatorHandler
     * @param UserAuthenticator $authenticator
     * @return JsonResponse
     */
    public function register(Request $request, UserService $userService, GuardAuthenticatorHandler $guardAuthenticatorHandler, UserAuthenticator $authenticator){

        $content = json_decode($request->getContent());

        try {
            $user = $userService->registerUser($content->username, $content->email, $content->password);
        }catch (MissingMandatoryParametersException $exception){
            return new JsonResponse(null, $exception->getMessage());
        }

        try {
            $this->em->persist($user);
            $this->em->flush();
        }catch (UniqueConstraintViolationException $exception){
            return new MyJsonResponse(null, 'Użytkownik o takiej nazwie już istnieje');
        }
        $guardAuthenticatorHandler
            ->authenticateUserAndHandleSuccess(
                $user,
                $request,
                $authenticator,
                'main'
                );

        return new MyJsonResponse(true);

    }

}