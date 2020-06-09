<?php

namespace App\Entity;

use App\Utils\Card\Card;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\RoomRepository")
 * @ORM\Table(name="Rooms")
 */
class Room
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $name;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $password;

    /**
     * @ORM\Column(type="integer")
     */
    private $maxPeople;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\User", mappedBy="room")
     */
    private $usersInRoom;

    /**
     * @ORM\Column(type="array", nullable=true)
     */
    private $currentDeck = [];

    /**
     * @ORM\Column(type="array", nullable=true)
     */
    private $usedDeck = [];

    /**
     * @ORM\Column(type="integer")
     */
    private $draw = 0;

    /**
     * @ORM\Column(type="integer")
     */
    private $stay= 0 ;

    /**
     * @ORM\Column(type="boolean")
     */
    private $isGameRunning = 0;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $gameType;

    /**
     * @var Card $currentCard
     * @ORM\Column(type="object", nullable=true)
     */
    private $currentCard;

    public function __construct()
    {
        $this->usersInRoom = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(?string $name): self
    {
        $this->name = $name;
        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(?string $password): self
    {
        $this->password = $password;

        return $this;
    }


    public function getMaxPeople(): ?int
    {
        return $this->maxPeople;
    }

    public function setMaxPeople(int $maxPeople): self
    {
        $this->maxPeople = $maxPeople;

        return $this;
    }


    /**
     * @return Collection|User[]
     */
    public function getUsersInRoom(): Collection
    {
        return $this->usersInRoom;
    }

    public function addUsersInRoom(User $usersInRoom): self
    {
        if (!$this->usersInRoom->contains($usersInRoom)) {
            $this->usersInRoom[] = $usersInRoom;
            $usersInRoom->setRoom($this);
        }

        return $this;
    }

    public function removeUsersInRoom(User $usersInRoom): self
    {
        if ($this->usersInRoom->contains($usersInRoom)) {
            $this->usersInRoom->removeElement($usersInRoom);
            // set the owning side to null (unless already changed)
            if ($usersInRoom->getRoom() === $this) {
                $usersInRoom->setRoom(null);
            }
        }

        return $this;
    }

    public function getCurrentDeck(): ?array
    {
        return $this->currentDeck;
    }

    public function setCurrentDeck(?array $currentDeck): self
    {
        $this->currentDeck = $currentDeck;

        return $this;
    }

    public function getUsedDeck(): ?array
    {
        return $this->usedDeck;
    }

    public function setUsedDeck(?array $usedDeck): self
    {
        $this->usedDeck = $usedDeck;

        return $this;
    }

    public function addUsedCards(array $usedCards){

        $this->usedDeck = array_merge($this->usedDeck, $usedCards);
    }

    public function getThreeCardsFromUsed(){
        if (count($this->usedDeck)>3){
            $cards = array_slice($this->usedDeck, -3);
        }elseif (count($this->usedDeck)==3){
            $cards = array_slice($this->usedDeck, -2);
        }elseif (count($this->usedDeck)==2){
            $cards = array_slice($this->usedDeck, -1);
        }else {
            $cards = [];
        }
        $this->usedDeck = array_diff($this->usedDeck, $cards);
        return $cards;
    }

    public function getDraw(): ?int
    {
        return $this->draw;
    }

    public function setDraw(int $draw): self
    {
        $this->draw = $draw;

        return $this;
    }

    public function getStay(): ?int
    {
        return $this->stay;
    }

    public function setStay(int $stay): self
    {
        $this->stay = $stay;

        return $this;
    }

    public function getIsGameRunning(): ?bool
    {
        return $this->isGameRunning;
    }

    public function setIsGameRunning(bool $isGameRunning): self
    {
        $this->isGameRunning = $isGameRunning;

        return $this;
    }

    public function getCurrentPlayer()
    {
        foreach ($this->getUsersInRoom() as $user) {
            if ($user->getIsNow())
                return $user;
        }
        return null;

    }

    public function getGameType(): ?string
    {
        return $this->gameType;
    }

    public function setGameType(?string $gameType): self
    {
        $this->gameType = $gameType;

        return $this;
    }

    public function drawCard(): Card{
        return array_pop($this->currentDeck);
    }

    public function getCurrentCard(): Card
    {
        return $this->currentCard;
    }

    public function setCurrentCard(Card $currentCard): self
    {
        $this->currentCard = $currentCard;

        return $this;
    }

}
