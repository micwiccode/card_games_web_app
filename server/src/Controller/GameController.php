<?php


namespace App\Controller;


use App\Entity\Room;
use App\Entity\User;
use App\Service\GameService;
use App\Service\PublisherService;
use App\Utils\Game\Game;
use App\Utils\Game\Macao;
use App\Utils\Response\MyJsonResponse;
use App\Utils\Struct\CardsResponseStruct;
use App\Utils\Struct\UserInGameResponseStruct;
use App\Utils\Struct\UserResponseStruct;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\User\UserInterface;

class GameController extends AbstractController
{

    private $em;

    private $gameService;

    private $publisherService;


    public function __construct(EntityManagerInterface $em, GameService $gameService, PublisherService $publisherService)
    {
        $this->em = $em;
        $this->gameService = $gameService;
        $this->publisherService = $publisherService;
    }

    private function getRoom($id): Room
    {
        /** @noinspection PhpIncompatibleReturnTypeInspection */
        return $this->em->getRepository(Room::class)->find($id);
    }

    /**
     * @Route("/room/{id}/start")
     * @param $id
     * @param Request $request
     * @return MyJsonResponse
     */
    public function startGame($id, Request $request)
    {
        $room = $this->getRoom($id);
        $content = json_decode($request->getContent());
        $gameType = $content->gameType;
        $this->gameService->startGame($room, $gameType);
        $this->em->flush();
        $this->publisherService->startGame($room);
        return new MyJsonResponse(true);
    }

    /**
     * @Route("/room/{id}/playCards")
     * @param Request $request
     * @param $id
     * @return MyJsonResponse
     */
    public function playCards(Request $request, $id)
    {
        $room = $this->getRoom($id);
        $content = json_decode($request->getContent());
        $cards = $content->cards;
        $cardRequest = $content->request;
        /** @var User $user */
        $user = $this->getUser();
        $action = $this->gameService->playCards($room, $user, $cards, $cardRequest);
        $this->em->flush();
        if ($action->type == Macao::DRAW_PREVIOUS){
            $nextUserAction = $this->gameService->previousUser($room);
        }else{
            $nextUserAction = $this->gameService->nextUser($room);
        }
        $action->target = UserInGameResponseStruct::mapFromUser($nextUserAction);
        if ($this->gameService->checkIfEnd($room, $user)){
            $this->publisherService->playCard($room, $action, $user, count($cards),true);
        }else{
            $this->publisherService->playCard($room, $action, $user, count($cards));
        }

        return new MyJsonResponse(true);

    }


    /**
     * @Route("/room/{id}/drawCards")
     * @param Request $request
     * @param $id
     * @return MyJsonResponse
     */
    public function drawCards(Request $request, $id)
    {
        $room = $this->getRoom($id);
        $content = json_decode($request->getContent());
        $cardsNumber = $content->cardsNumber;
        /** @var User $user */
        $user = $this->getUser();
        $cards = $this->gameService->drawCards($room, $user, $cardsNumber);
        $this->em->flush();
        $this->publisherService->drawCards($room, $user, $cardsNumber);
        return new MyJsonResponse(CardsResponseStruct::mapFromCardsArray($cards));

    }

    /**
     * @Route("/room/{id}/nextUser")
     * @param $id
     * @return MyJsonResponse
     */
    public function nextUser($id){
        $room = $this->getRoom($id);
        $user = $this->gameService->nextUser($room);
        $this->publisherService->nextUser($room, $user);
        return new MyJsonResponse(true);
    }

    /**
     * @Route("/room/{id}/pan/playCards")
     * @param $id
     * @param Request $request
     */
    public function playCardsPan($id, Request $request){
        $room = $this->getRoom($id);
        if ($room->getGameType()==Game::PAN){
            $content = json_decode($request->getContent());
            $cards = $content->cards;
            /** @var User $user */
            $user = $this->getUser();
            $user->removeCards($cards);
            $room->addUsedCards($cards);
            $this->getDoctrine()->getManager()->flush();
            $nextUser = $this->gameService->nextUser($room);
            $this->publisherService->nextUser($room, $nextUser);

        }

    }
}
